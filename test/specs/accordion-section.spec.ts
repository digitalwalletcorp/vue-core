import { describe, it, expect, vi, afterEach } from 'vitest';
import { defineComponent, h, markRaw, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import AccordionSection from '@/accordion-section.vue';
import type { LabelPreset } from '@/types/label-preset';
import { mockResizeObserver } from '#/helpers/resize-observer';

// mount()はpropsをreactiveで包むため、コンポーネントをmarkRawしておかないとVueが警告を出す
const OpenIcon = markRaw(defineComponent({
  props: { size: { type: String, default: undefined } },
  setup: props => () => h('svg', { 'data-open-icon': '', 'data-size': props.size })
}));
const CloseIcon = markRaw(defineComponent({
  setup: () => () => h('svg', { 'data-close-icon': '' })
}));

const openPreset: LabelPreset = { icon: OpenIcon, iconProps: { size: '12px' }, label: () => 'OPEN' };
const closePreset: LabelPreset = { icon: CloseIcon, label: 'CLOSE' };

/**
 * 中身が縮められる高さのAccordionSectionをマウントする
 *
 * @param {Parameters<typeof mount>[1]} options
 * @returns {Promise<ReturnType<typeof mount>>}
 */
const mountShrinkable = async (options: Parameters<typeof mount>[1] = {}) => {
  const { resize } = mockResizeObserver();
  const wrapper = mount(AccordionSection, options);
  resize(100);
  await nextTick();
  return wrapper;
};

describe('AccordionSection', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  describe('shrink', () => {
    it('is collapsed by default and expanded when initialExpand is true', async () => {
      const collapsed = await mountShrinkable();
      expect(collapsed.find('button').attributes('aria-expanded')).toBe('false');
      expect(collapsed.find('.dwui-accordion-section-contents').classes()).toContain('dwui-shrunk');

      const expanded = await mountShrinkable({ props: { initialExpand: true } });
      expect(expanded.find('button').attributes('aria-expanded')).toBe('true');
      expect(expanded.find('.dwui-accordion-section-contents').classes()).toContain('dwui-expanded');
    });

    it('toggles the contents', async () => {
      const wrapper = await mountShrinkable();
      await wrapper.find('button').trigger('click');
      expect(wrapper.find('.dwui-accordion-section-contents').classes()).toContain('dwui-expanded');
      await wrapper.find('button').trigger('click');
      expect(wrapper.find('.dwui-accordion-section-contents').classes()).toContain('dwui-shrunk');
    });

    it('does not show the toggle when the contents are lower than the shrunk height', async () => {
      const { resize } = mockResizeObserver();
      const wrapper = mount(AccordionSection);
      resize(30);
      await nextTick();
      expect(wrapper.find('button').exists()).toBe(false);
      expect(wrapper.find('.dwui-accordion-section-contents').classes()).not.toContain('dwui-shrunk');
    });

    it('shows the toggle once the contents become taller', async () => {
      const { resize } = mockResizeObserver();
      const wrapper = mount(AccordionSection);
      // 隠れたタブの中にあるなど、表示されていない間は高さが0になる
      resize(0);
      await nextTick();
      expect(wrapper.find('button').exists()).toBe(false);

      resize(100);
      await nextTick();
      expect(wrapper.find('button').exists()).toBe(true);
    });

    it('marks the contents not to be faded when noGradient is true', async () => {
      const wrapper = await mountShrinkable({ props: { noGradient: true } });
      expect(wrapper.find('.dwui-accordion-section-contents').classes()).toContain('dwui-no-gradient');
    });

    it('disables the toggle', async () => {
      const wrapper = await mountShrinkable({ props: { disabled: true } });
      expect(wrapper.find('button').attributes('disabled')).toBeDefined();
    });
  });

  describe('toggle contents', () => {
    it('shows the triangle when nothing is given', async () => {
      const wrapper = await mountShrinkable();
      expect(wrapper.find('button .dwui-label-icon').exists()).toBe(false);
      expect(wrapper.find('button svg').exists()).toBe(true);
    });

    it('shows only the icons from the slots', async () => {
      const wrapper = await mountShrinkable({
        slots: { 'open-icon': () => h('i', { 'data-slot-open': '' }), 'close-icon': () => h('i', { 'data-slot-close': '' }) }
      });
      expect(wrapper.find('button [data-slot-open]').exists()).toBe(true);
      expect(wrapper.find('button .dwui-label').exists()).toBe(false);

      await wrapper.find('button').trigger('click');
      expect(wrapper.find('button [data-slot-close]').exists()).toBe(true);
      expect(wrapper.find('button [data-slot-open]').exists()).toBe(false);
    });

    it('shows only the labels', async () => {
      const wrapper = await mountShrinkable({ props: { openLabel: 'More', closeLabel: 'Less' } });
      expect(wrapper.find('button .dwui-label').text()).toBe('More');
      expect(wrapper.find('button svg').exists()).toBe(false);

      await wrapper.find('button').trigger('click');
      expect(wrapper.find('button .dwui-label').text()).toBe('Less');
    });

    it('shows the icon and the label of the presets', async () => {
      const wrapper = await mountShrinkable({ props: { openPreset, closePreset } });
      expect(wrapper.find('button [data-open-icon]').attributes('data-size')).toBe('12px');
      expect(wrapper.find('button .dwui-label').text()).toBe('OPEN');

      await wrapper.find('button').trigger('click');
      expect(wrapper.find('button [data-close-icon]').exists()).toBe(true);
      expect(wrapper.find('button .dwui-label').text()).toBe('CLOSE');
    });

    it('prefers the slot and the label to the preset, separately', async () => {
      const iconOnly = await mountShrinkable({
        props: { openPreset },
        slots: { 'open-icon': () => h('i', { 'data-slot-open': '' }) }
      });
      expect(iconOnly.find('button [data-slot-open]').exists()).toBe(true);
      expect(iconOnly.find('button [data-open-icon]').exists()).toBe(false);
      expect(iconOnly.find('button .dwui-label').text()).toBe('OPEN');

      const labelOnly = await mountShrinkable({ props: { openPreset, openLabel: 'More' } });
      expect(labelOnly.find('button [data-open-icon]').exists()).toBe(true);
      expect(labelOnly.find('button .dwui-label').text()).toBe('More');
    });
  });

  describe('attributes', () => {
    it('applies class and style to the root element', () => {
      mockResizeObserver();
      const wrapper = mount(AccordionSection, { attrs: { class: 'text-humble', style: 'margin-top: 4px;' } });
      expect(wrapper.classes()).toEqual(expect.arrayContaining(['dwui-accordion-section', 'text-humble']));
      expect(wrapper.attributes('style')).toContain('margin-top: 4px');
    });
  });
});
