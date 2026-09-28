import { describe, it, expect } from 'vitest';
import { h } from 'vue';
import { mount } from '@vue/test-utils';
import PageTitle from '@/page-title.vue';

describe('PageTitle', () => {
  it('renders the title as text', () => {
    const wrapper = mount(PageTitle, { props: { title: '<b>Dashboard</b>' } });
    expect(wrapper.find('.dwui-page-title-label .dwui-label').text()).toBe('<b>Dashboard</b>');
    expect(wrapper.find('b').exists()).toBe(false);
  });

  it('renders the #icon slot before the title', () => {
    const wrapper = mount(PageTitle, {
      props: { title: 'Dashboard' },
      slots: { icon: () => h('svg', { 'data-icon': '' }) }
    });
    const label = wrapper.find('.dwui-page-title-label');
    expect(label.element.firstElementChild?.hasAttribute('data-icon')).toBe(true);
  });

  it('renders the default slot in the actions only when it is given', () => {
    const withoutActions = mount(PageTitle, { props: { title: 'Dashboard' } });
    expect(withoutActions.find('.dwui-page-title-actions').exists()).toBe(false);

    const withActions = mount(PageTitle, {
      props: { title: 'Dashboard' },
      slots: { default: () => h('button', 'Reload') }
    });
    expect(withActions.find('.dwui-page-title-actions button').text()).toBe('Reload');
  });

  it('applies class and style to the root element', () => {
    const wrapper = mount(PageTitle, { props: { title: 'Dashboard' }, attrs: { class: 'mt8', style: 'width: 1000px;' } });
    expect(wrapper.element.tagName).toBe('SECTION');
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['dwui-page-title', 'mt8']));
    expect(wrapper.attributes('style')).toContain('width: 1000px');
  });
});
