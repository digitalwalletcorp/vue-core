import { describe, it, expect } from 'vitest';
import { defineComponent, h, markRaw, ref } from 'vue';
import { mount } from '@vue/test-utils';
import LabelIcon from '@/label-icon.vue';
import type { LabelPreset } from '@/types/label-preset';

// mount()はpropsをreactiveで包むため、コンポーネントをmarkRawしておかないとVueが警告を出す
const DummyIcon = markRaw(defineComponent({
  props: { direction: String },
  setup: (props) => () => h('svg', { 'data-direction': props.direction })
}));

const preset: LabelPreset = {
  icon: DummyIcon,
  iconProps: { direction: 'down' },
  label: 'Search'
};

describe('LabelIcon', () => {
  it('renders the icon and label of the preset', () => {
    const wrapper = mount(LabelIcon, { props: { preset } });
    expect(wrapper.element.tagName).toBe('SPAN');
    expect(wrapper.classes()).toContain('dwui-label-icon');
    expect(wrapper.find('svg').attributes('data-direction')).toBe('down');
    expect(wrapper.text()).toBe('Search');
  });

  it('calls the label function on every render', async () => {
    const locale = ref('ja');
    const wrapper = mount(LabelIcon, {
      props: {
        preset: {
          icon: DummyIcon,
          label: () => (locale.value === 'ja' ? '検索' : 'Search')
        }
      }
    });
    expect(wrapper.text()).toBe('検索');
    locale.value = 'en';
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toBe('Search');
  });

  it('prefers the slots over the preset', () => {
    const wrapper = mount(LabelIcon, {
      props: { preset },
      slots: {
        icon: () => h('i', { class: 'slot-icon' }),
        default: () => 'DUPLICATE DETAIL'
      }
    });
    expect(wrapper.find('svg').exists()).toBe(false);
    expect(wrapper.find('i.slot-icon').exists()).toBe(true);
    expect(wrapper.text()).toBe('DUPLICATE DETAIL');
  });

  it('wraps the label slot in a single element', () => {
    const wrapper = mount(LabelIcon, {
      slots: { default: () => ['foo ', h('b', 'bar')] }
    });
    const children = wrapper.element.children;
    expect(children).toHaveLength(1);
    expect(children[0].innerHTML).toBe('foo <b>bar</b>');
  });

  it('renders nothing inside without preset and slots', () => {
    const wrapper = mount(LabelIcon);
    expect(wrapper.element.children).toHaveLength(0);
  });

  it('sets gap only when specified', () => {
    expect(mount(LabelIcon, { props: { preset } }).attributes('style')).toBeUndefined();
    expect(mount(LabelIcon, { props: { preset, gap: '0.5em' } }).attributes('style')).toBe('--dwui-label-icon-gap: 0.5em;');
  });

  it('applies class and style to each part', () => {
    const wrapper = mount(LabelIcon, {
      props: {
        preset,
        iconClass: 'icon-part',
        iconStyle: { color: 'red' },
        labelClass: ['label-part'],
        labelStyle: 'font-weight: bold;'
      },
      attrs: {
        class: 'root-part',
        style: 'margin: 1px;'
      }
    });
    expect(wrapper.classes()).toEqual(['dwui-label-icon', 'root-part']);
    expect(wrapper.attributes('style')).toBe('margin: 1px;');
    const svg = wrapper.find('svg');
    expect(svg.classes()).toContain('icon-part');
    expect(svg.attributes('style')).toBe('color: red;');
    const label = wrapper.find('span > span');
    expect(label.classes()).toContain('label-part');
    expect(label.attributes('style')).toBe('font-weight: bold;');
  });
});
