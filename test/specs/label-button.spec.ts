import { describe, it, expect } from 'vitest';
import { defineComponent, h, markRaw } from 'vue';
import { mount } from '@vue/test-utils';
import LabelButton from '@/label-button.vue';
import type { LabelPreset } from '@/types/label-preset';

// mount()はpropsをreactiveで包むため、コンポーネントをmarkRawしておかないとVueが警告を出す
const DummyIcon = markRaw(defineComponent({
  setup: () => () => h('svg')
}));

const preset: LabelPreset = {
  icon: DummyIcon,
  label: 'Search'
};

describe('LabelButton', () => {
  it('renders the preset inside a button', () => {
    const wrapper = mount(LabelButton, { props: { preset } });
    expect(wrapper.element.tagName).toBe('BUTTON');
    expect(wrapper.find('button > .dwui-label-icon > svg').exists()).toBe(true);
    expect(wrapper.text()).toBe('Search');
  });

  it('has its own class so that the default styles do not depend on the button element', () => {
    const wrapper = mount(LabelButton, { props: { preset } });
    expect(wrapper.classes()).toEqual(['dwui-label-button']);
  });

  it('passes attributes through to the button without a default type', async () => {
    let clicked = 0;
    const wrapper = mount(LabelButton, {
      props: { preset },
      attrs: {
        class: 'btn',
        style: 'margin: 1px;',
        disabled: true,
        onClick: () => {
          clicked++;
        }
      }
    });
    expect(wrapper.classes()).toEqual(['dwui-label-button', 'btn']);
    expect(wrapper.attributes('style')).toBe('margin: 1px;');
    expect(wrapper.attributes('disabled')).toBeDefined();
    expect(wrapper.attributes('type')).toBeUndefined();
    expect(mount(LabelButton, { attrs: { type: 'submit' } }).attributes('type')).toBe('submit');

    wrapper.element.removeAttribute('disabled');
    await wrapper.trigger('click');
    expect(clicked).toBe(1);
  });

  it('keeps the preset when only one slot is given', () => {
    const wrapper = mount(LabelButton, {
      props: { preset },
      slots: { default: () => 'DUPLICATE DETAIL' }
    });
    expect(wrapper.find('svg').exists()).toBe(true);
    expect(wrapper.text()).toBe('DUPLICATE DETAIL');

    const iconOnly = mount(LabelButton, {
      props: { preset },
      slots: { icon: () => h('i') }
    });
    expect(iconOnly.find('svg').exists()).toBe(false);
    expect(iconOnly.find('i').exists()).toBe(true);
    expect(iconOnly.text()).toBe('Search');
  });

  it('passes gap and part styles to the inner label', () => {
    const wrapper = mount(LabelButton, {
      props: {
        preset,
        gap: '0.5em',
        iconClass: 'icon-part',
        labelClass: 'label-part'
      }
    });
    expect(wrapper.find('.dwui-label-icon').attributes('style')).toBe('--dwui-gap-label-icon: 0.5em;');
    expect(wrapper.find('svg').classes()).toContain('icon-part');
    expect(wrapper.find('.label-part').text()).toBe('Search');
  });
});
