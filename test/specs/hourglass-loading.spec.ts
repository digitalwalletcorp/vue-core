import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import HourglassLoading from '@/hourglass-loading.vue';

describe('HourglassLoading', () => {
  it('shows the hourglass instead of the slot while loading', () => {
    const wrapper = mount(HourglassLoading, {
      props: { loading: true },
      slots: { default: () => 'value' }
    });
    expect(wrapper.find('svg.dwui-hourglass-loading').exists()).toBe(true);
    expect(wrapper.text()).not.toContain('value');
  });

  it('shows the slot after loading, even if the value is empty', async () => {
    const wrapper = mount(HourglassLoading, {
      props: { loading: true },
      slots: { default: () => '' }
    });
    await wrapper.setProps({ loading: false });
    expect(wrapper.find('svg').exists()).toBe(false);
    expect(wrapper.text()).toBe('');
  });

  it('passes the size to the hourglass', () => {
    const wrapper = mount(HourglassLoading, { props: { loading: true, size: 16 } });
    expect(wrapper.find('svg').attributes('style')).toContain('--vue-svg-icons-size: 16px;');
  });
});
