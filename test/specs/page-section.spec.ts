import { describe, it, expect } from 'vitest';
import { h } from 'vue';
import { mount } from '@vue/test-utils';
import { SvgCircle, SvgDiamond, SvgPushpin, SvgRoundPushpin, SvgSquare } from '@digitalwalletcorp/vue-svg-icons';
import PageSection from '@/page-section.vue';

describe('PageSection', () => {
  describe('title', () => {
    it('renders the title as text with a diamond by default', () => {
      const wrapper = mount(PageSection, { props: { title: '<b>Summary</b>' } });
      expect(wrapper.find('.dwui-page-section-title .dwui-label').text()).toBe('<b>Summary</b>');
      expect(wrapper.find('.dwui-page-section-title b').exists()).toBe(false);
      expect(wrapper.findComponent(SvgDiamond).exists()).toBe(true);
    });

    it('does not render the title when it is not given', () => {
      const wrapper = mount(PageSection, { slots: { default: () => 'contents' } });
      expect(wrapper.find('.dwui-page-section-title').exists()).toBe(false);
      expect(wrapper.find('.dwui-page-section-content').text()).toBe('contents');
    });

    it('applies titleClass and titleStyle to the title', () => {
      const wrapper = mount(PageSection, {
        props: { title: 'Summary', titleClass: 'text-safe', titleStyle: { fontWeight: '700' } }
      });
      const title = wrapper.find('.dwui-page-section-title');
      expect(title.classes()).toContain('text-safe');
      expect(title.attributes('style')).toContain('font-weight: 700');
    });
  });

  describe('icon', () => {
    it.each([
      ['circle', SvgCircle],
      ['square', SvgSquare]
    ] as const)('passes the variant and the color to %s', (icon, component) => {
      const wrapper = mount(PageSection, {
        props: { title: 'Summary', icon, iconVariant: 'small', iconColor: '#f09536' }
      });
      const rendered = wrapper.findComponent(component);
      expect(rendered.props('variant')).toBe('small');
      expect(rendered.props('color')).toBe('#f09536');
    });

    it.each([
      ['diamond', SvgDiamond, '#1a44b6'],
      ['circle', SvgCircle, '#e78b2f'],
      ['square', SvgSquare, '#d13a2b']
    ] as const)('uses its own default color for %s', (icon, component, color) => {
      const wrapper = mount(PageSection, { props: { title: 'Summary', icon } });
      const rendered = wrapper.findComponent(component);
      expect(rendered.props('variant')).toBe('large');
      expect(rendered.props('color')).toBe(color);
    });

    it.each([
      ['pushpin', SvgPushpin],
      ['round-pushpin', SvgRoundPushpin]
    ] as const)('renders %s', (icon, component) => {
      const wrapper = mount(PageSection, { props: { title: 'Summary', icon } });
      expect(wrapper.findComponent(component).exists()).toBe(true);
    });

    it('renders the #icon slot instead of the icon prop', () => {
      const wrapper = mount(PageSection, {
        props: { title: 'Summary', icon: 'circle' },
        slots: { icon: () => h('svg', { 'data-icon': '' }) }
      });
      expect(wrapper.find('[data-icon]').exists()).toBe(true);
      expect(wrapper.findComponent(SvgCircle).exists()).toBe(false);
    });
  });

  it('applies class and style to the root element', () => {
    const wrapper = mount(PageSection, { props: { title: 'Summary' }, attrs: { class: 'mt8', style: 'width: 1620px;' } });
    expect(wrapper.element.tagName).toBe('SECTION');
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['dwui-page-section', 'mt8']));
    expect(wrapper.attributes('style')).toContain('width: 1620px');
  });
});
