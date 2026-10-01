import { describe, it, expect, vi, afterEach } from 'vitest';
import { defineComponent, h, markRaw, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import AccordionFieldset from '@/accordion-fieldset.vue';
import { mockResizeObserver } from '#/helpers/resize-observer';

// mount()はpropsをreactiveで包むため、コンポーネントをmarkRawしておかないとVueが警告を出す
const DummyIcon = markRaw(defineComponent({
  setup: () => () => h('svg', { 'data-dummy-icon': '' })
}));

describe('AccordionFieldset', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  describe('legend', () => {
    it('has its own class so that the application can style it without the element selector', () => {
      const wrapper = mount(AccordionFieldset, { props: { legend: 'Filtering' } });
      expect(wrapper.find('legend').classes()).toEqual(['dwui-accordion-legend']);
    });

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
      const { resize } = mockResizeObserver();
      const wrapper = mount(AccordionFieldset, { props: { initialExpand: true } });
      resize(100);
      await wrapper.find('button').trigger('click');
      expect(wrapper.find('button').attributes('aria-expanded')).toBe('false');
      expect(wrapper.find('.dwui-accordion-contents').classes()).toContain('dwui-shrunk');

      await wrapper.find('button').trigger('click');
      expect(wrapper.find('.dwui-accordion-contents').classes()).toContain('dwui-expanded');
    });

    it('does not shrink the contents when they are lower than the shrunk height', async () => {
      const { resize } = mockResizeObserver();
      const wrapper = mount(AccordionFieldset, { props: { initialExpand: true } });
      resize(30);
      await wrapper.find('button').trigger('click');
      const classes = wrapper.find('.dwui-accordion-contents').classes();
      expect(classes).not.toContain('dwui-shrunk');
      expect(classes).not.toContain('dwui-expanded');
    });

    it('re-evaluates whether the contents can shrink when their size changes', async () => {
      const { resize } = mockResizeObserver();
      const wrapper = mount(AccordionFieldset, { props: { initialExpand: true } });
      // 隠れたタブの中にあるなど、表示されていない間は高さが0になる
      resize(0);
      await nextTick();
      expect(wrapper.find('.dwui-accordion-contents').classes()).not.toContain('dwui-expanded');

      resize(100);
      await nextTick();
      expect(wrapper.find('.dwui-accordion-contents').classes()).toContain('dwui-expanded');
    });

    it('stops observing the contents when unmounted', () => {
      const { observing } = mockResizeObserver();
      const wrapper = mount(AccordionFieldset);
      expect(observing()).toBe(1);
      wrapper.unmount();
      expect(observing()).toBe(0);
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
