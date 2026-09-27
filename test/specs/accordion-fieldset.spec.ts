import { describe, it, expect, vi, afterEach } from 'vitest';
import { defineComponent, h, markRaw, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import AccordionFieldset from '@/accordion-fieldset.vue';

// mount()はpropsをreactiveで包むため、コンポーネントをmarkRawしておかないとVueが警告を出す
const DummyIcon = markRaw(defineComponent({
  setup: () => () => h('svg', { 'data-dummy-icon': '' })
}));

/**
 * 中身の高さをgetBoundingClientRectの戻り値で差し替える
 *
 * @param {number} height
 */
const mockContentsHeight = (height: number) => {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({ height } as DOMRect);
};

describe('AccordionFieldset', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('legend', () => {
    it('renders the legend as text', () => {
      const wrapper = mount(AccordionFieldset, { props: { legend: '<b>Filtering</b>' } });
      expect(wrapper.find('legend .dwui-label').text()).toBe('<b>Filtering</b>');
      expect(wrapper.find('legend b').exists()).toBe(false);
    });

    it('renders the #legend slot instead of the legend prop', () => {
      const wrapper = mount(AccordionFieldset, {
        props: { legend: 'Filtering' },
        slots: { legend: () => h('strong', 'Latest Jobs') }
      });
      expect(wrapper.find('legend .dwui-label').html()).toContain('<strong>Latest Jobs</strong>');
      expect(wrapper.find('legend').text()).not.toContain('Filtering');
    });

    it('renders the #icon slot before the legend', () => {
      const wrapper = mount(AccordionFieldset, {
        props: { legend: 'Filtering' },
        slots: { icon: () => h(DummyIcon) }
      });
      const labelIcon = wrapper.find('legend .dwui-label-icon');
      expect(labelIcon.element.firstElementChild?.hasAttribute('data-dummy-icon')).toBe(true);
      expect(labelIcon.find('.dwui-label').text()).toBe('Filtering');
    });

    it('does not render an empty label when only the icon is given', () => {
      const wrapper = mount(AccordionFieldset, { slots: { icon: () => h(DummyIcon) } });
      expect(wrapper.find('legend [data-dummy-icon]').exists()).toBe(true);
      expect(wrapper.find('legend .dwui-label').exists()).toBe(false);
    });

    it('renders only the toggle when neither legend nor icon is given', () => {
      const wrapper = mount(AccordionFieldset);
      expect(wrapper.find('legend .dwui-label-icon').exists()).toBe(false);
      expect(wrapper.find('legend .dwui-accordion-toggle svg').exists()).toBe(true);
    });
  });

  describe('toggle', () => {
    it('is collapsed by default and expanded when initialExpand is true', async () => {
      const collapsed = mount(AccordionFieldset);
      await nextTick();
      expect(collapsed.find('button').attributes('aria-expanded')).toBe('false');

      const expanded = mount(AccordionFieldset, { props: { initialExpand: true } });
      await nextTick();
      expect(expanded.find('button').attributes('aria-expanded')).toBe('true');
    });

    it('shrinks the contents when they are taller than the shrunk height', async () => {
      mockContentsHeight(100);
      const wrapper = mount(AccordionFieldset, { props: { initialExpand: true } });
      await wrapper.find('button').trigger('click');
      expect(wrapper.find('button').attributes('aria-expanded')).toBe('false');
      expect(wrapper.find('.dwui-accordion-contents').classes()).toContain('dwui-shrunk');

      await wrapper.find('button').trigger('click');
      expect(wrapper.find('.dwui-accordion-contents').classes()).toContain('dwui-expanded');
    });

    it('does not shrink the contents when they are lower than the shrunk height', async () => {
      mockContentsHeight(30);
      const wrapper = mount(AccordionFieldset, { props: { initialExpand: true } });
      await wrapper.find('button').trigger('click');
      const classes = wrapper.find('.dwui-accordion-contents').classes();
      expect(classes).not.toContain('dwui-shrunk');
      expect(classes).not.toContain('dwui-expanded');
    });

    it('re-evaluates whether the contents can shrink when the observer changes', async () => {
      mockContentsHeight(30);
      const wrapper = mount(AccordionFieldset, { props: { initialExpand: true, observer: { rows: 1 } } });
      await nextTick();
      expect(wrapper.find('.dwui-accordion-contents').classes()).not.toContain('dwui-expanded');

      mockContentsHeight(100);
      await wrapper.setProps({ observer: { rows: 10 } });
      expect(wrapper.find('.dwui-accordion-contents').classes()).toContain('dwui-expanded');
    });
  });

  describe('attributes', () => {
    it('applies class and style to the root fieldset', () => {
      const wrapper = mount(AccordionFieldset, { attrs: { class: 'job-group', style: 'border-color: red;' } });
      expect(wrapper.element.tagName).toBe('FIELDSET');
      expect(wrapper.classes()).toEqual(expect.arrayContaining(['dwui-accordion-fieldset', 'job-group']));
      expect(wrapper.attributes('style')).toContain('border-color: red');
    });

    it('disables the fieldset', () => {
      const wrapper = mount(AccordionFieldset, { props: { disabled: true } });
      expect(wrapper.attributes('disabled')).toBeDefined();
    });
  });
});
