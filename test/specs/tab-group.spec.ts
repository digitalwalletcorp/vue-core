import { describe, it, expect } from 'vitest';
import { createSSRApp, defineComponent, h, markRaw, nextTick, ref } from 'vue';
import type { PropType } from 'vue';
import { mount } from '@vue/test-utils';
import { renderToString } from 'vue/server-renderer';
import TabGroup from '@/tab-group.vue';
import TabContent from '@/tab-content.vue';

// mount()はpropsをreactiveで包むため、コンポーネントをmarkRawしておかないとVueが警告を出す
const DummyIcon = markRaw(defineComponent({
  setup: () => () => h('svg', { 'data-dummy-icon': '' })
}));

/**
 * activatedを受け取って表示するタブの中身
 */
const Probe = markRaw(defineComponent({
  props: {
    activated: Boolean,
    setLoading: Function as PropType<(value: boolean) => void>
  },
  setup: (props) => () => h('span', { class: 'probe' }, props.activated ? 'activated' : 'inactive')
}));

describe('TabGroup / TabContent', () => {

  describe('headers', () => {
    it('renders a header for each TabContent', () => {
      const wrapper = mount({
        components: { TabGroup, TabContent },
        template: `
          <TabGroup>
            <TabContent label-id="a" description="Basic">A</TabContent>
            <TabContent label-id="b" description="History">B</TabContent>
          </TabGroup>
        `
      });
      expect(wrapper.findAll('.dwui-tab-item').map(item => item.text())).toEqual(['Basic', 'History']);
      expect(wrapper.find('.dwui-tab-radio:checked + .dwui-tab-item').text()).toBe('Basic');
    });

    it('renders headers of TabContents rendered by v-for', () => {
      const wrapper = mount({
        components: { TabGroup, TabContent },
        setup: () => ({ items: ['x', 'y', 'z'] }),
        template: `
          <TabGroup>
            <TabContent v-for="item in items" :key="item" :label-id="item" :description="item.toUpperCase()">{{ item }}</TabContent>
          </TabGroup>
        `
      });
      expect(wrapper.findAll('.dwui-tab-item').map(item => item.text())).toEqual(['X', 'Y', 'Z']);
    });

    it('recognizes TabContent by its component type, not by its props', () => {
      const Other = markRaw(defineComponent({
        props: { labelId: String, description: String },
        setup: () => () => h('div')
      }));
      const wrapper = mount({
        components: { TabGroup, TabContent, Other },
        template: `
          <TabGroup>
            <Other label-id="x" description="Other" />
            <TabContent label-id="a" description="">A</TabContent>
          </TabGroup>
        `
      });
      // TabContent以外は見出しにせず、descriptionが空のTabContentは空の見出しとして出す
      expect(wrapper.findAll('.dwui-tab-item').map(item => item.text())).toEqual(['']);
    });

    it('renders the #icon slot of TabContent in the header, not in the contents', () => {
      const wrapper = mount({
        components: { TabGroup, TabContent },
        setup: () => ({ DummyIcon }),
        template: `
          <TabGroup>
            <TabContent label-id="a" description="Basic">
              <template #icon><component :is="DummyIcon" /></template>
              contents
            </TabContent>
            <TabContent label-id="b" description="History">B</TabContent>
          </TabGroup>
        `
      });
      const headers = wrapper.findAll('.dwui-tab-item');
      expect(headers[0].find('[data-dummy-icon]').exists()).toBe(true);
      expect(headers[0].text()).toBe('Basic');
      expect(headers[1].find('[data-dummy-icon]').exists()).toBe(false);
      expect(wrapper.find('.dwui-tab-content [data-dummy-icon]').exists()).toBe(false);
    });

    it('applies the status and headerClass to the header', () => {
      const wrapper = mount({
        components: { TabGroup, TabContent },
        template: `
          <TabGroup>
            <TabContent label-id="a" description="Basic" status="error" header-class="custom">A</TabContent>
            <TabContent label-id="b" description="History" status="warn">B</TabContent>
          </TabGroup>
        `
      });
      const headers = wrapper.findAll('.dwui-tab-item');
      expect(headers[0].classes()).toEqual(expect.arrayContaining(['dwui-tab-error', 'custom']));
      expect(headers[1].classes()).toContain('dwui-tab-warn');
    });

    it('disables the header and does not render the contents of a disabled TabContent', () => {
      const wrapper = mount({
        components: { TabGroup, TabContent },
        template: `
          <TabGroup>
            <TabContent label-id="a" description="Basic">A</TabContent>
            <TabContent label-id="b" description="History" disabled>B</TabContent>
          </TabGroup>
        `
      });
      expect(wrapper.findAll('.dwui-tab-radio')[1].attributes('disabled')).toBeDefined();
      expect(wrapper.find('[data-test-tab-content="b"]').exists()).toBe(false);
    });
  });

  describe('selection', () => {
    it('shows only the selected TabContent', () => {
      const wrapper = mount({
        components: { TabGroup, TabContent },
        template: `
          <TabGroup selected-tab-label-id="b">
            <TabContent label-id="a" description="Basic">A</TabContent>
            <TabContent label-id="b" description="History">B</TabContent>
          </TabGroup>
        `
      });
      expect(wrapper.find('[data-test-tab-content="a"]').attributes('aria-checked')).toBe('false');
      expect(wrapper.find('[data-test-tab-content="b"]').attributes('aria-checked')).toBe('true');
    });

    it('switches the tab and emits emit:changeSelectedTab when a header is selected', async () => {
      const wrapper = mount(TabGroup, {
        slots: {
          default: () => [
            h(TabContent, { labelId: 'a', description: 'Basic' }, () => 'A'),
            h(TabContent, { labelId: 'b', description: 'History' }, () => 'B')
          ]
        }
      });
      await wrapper.findAll('.dwui-tab-radio')[1].trigger('change');
      expect(wrapper.emitted('emit:changeSelectedTab')).toEqual([['b']]);
      expect(wrapper.find('[data-test-tab-content="b"]').attributes('aria-checked')).toBe('true');
    });

    it('follows changes of selectedTabLabelId', async () => {
      const selected = ref('a');
      const wrapper = mount({
        components: { TabGroup, TabContent },
        setup: () => ({ selected }),
        template: `
          <TabGroup :selected-tab-label-id="selected">
            <TabContent label-id="a" description="Basic">A</TabContent>
            <TabContent label-id="b" description="History">B</TabContent>
          </TabGroup>
        `
      });
      selected.value = 'b';
      await nextTick();
      expect(wrapper.find('[data-test-tab-content="b"]').attributes('aria-checked')).toBe('true');
    });
  });

  describe('selection by the parent', () => {
    it('reselects a tab assigned by the parent through v-model after the user switched tabs', async () => {
      const selected = ref('a');
      const wrapper = mount({
        components: { TabGroup, TabContent },
        setup: () => ({ selected }),
        template: `
          <TabGroup v-model:selected-tab-label-id="selected">
            <TabContent label-id="a" description="Basic">A</TabContent>
            <TabContent label-id="b" description="History">B</TabContent>
          </TabGroup>
        `
      });
      await wrapper.findAll('.dwui-tab-radio')[1].trigger('change');
      expect(selected.value).toBe('b');

      // 保存後に先頭へ戻すなど、親から選び直す
      selected.value = 'a';
      await nextTick();
      expect(wrapper.find('[data-test-tab-content="a"]').attributes('aria-checked')).toBe('true');
    });

    it('selects the first tab even if it is disabled by default', () => {
      const wrapper = mount({
        components: { TabGroup, TabContent },
        template: `
          <TabGroup>
            <TabContent label-id="a" description="Basic" disabled>A</TabContent>
            <TabContent label-id="b" description="History">B</TabContent>
          </TabGroup>
        `
      });
      expect(wrapper.find('.dwui-tab-radio:checked + .dwui-tab-item').text()).toBe('Basic');
      expect(wrapper.find('[data-test-tab-content="b"]').attributes('aria-checked')).toBe('false');
    });

    it('selects the first enabled tab with selectFirstEnabled', () => {
      const wrapper = mount({
        components: { TabGroup, TabContent },
        template: `
          <TabGroup select-first-enabled>
            <TabContent label-id="a" description="Basic" disabled>A</TabContent>
            <TabContent label-id="b" description="History">B</TabContent>
          </TabGroup>
        `
      });
      expect(wrapper.find('[data-test-tab-content="b"]').attributes('aria-checked')).toBe('true');
    });
  });

  describe('slot props', () => {
    it('passes activated only to the selected TabContent after TabGroup is mounted', async () => {
      const wrapper = mount({
        components: { TabGroup, TabContent, Probe },
        template: `
          <TabGroup>
            <TabContent v-slot="{ activated }" label-id="a" description="Basic"><Probe :activated="activated" /></TabContent>
            <TabContent v-slot="{ activated }" label-id="b" description="History"><Probe :activated="activated" /></TabContent>
          </TabGroup>
        `
      });
      await nextTick();
      expect(wrapper.findAll('.probe').map(probe => probe.text())).toEqual(['activated', 'inactive']);

      await wrapper.findAll('.dwui-tab-radio')[1].trigger('change');
      expect(wrapper.findAll('.probe').map(probe => probe.text())).toEqual(['inactive', 'activated']);
    });

    it('does not pass activated before TabGroup is mounted', () => {
      const activatedOnSetup: boolean[] = [];
      const Recorder = markRaw(defineComponent({
        props: { activated: Boolean },
        setup: (props) => {
          activatedOnSetup.push(props.activated);
          return () => h('span');
        }
      }));
      mount({
        components: { TabGroup, TabContent, Recorder },
        template: `
          <TabGroup>
            <TabContent v-slot="{ activated }" label-id="a" description="Basic"><Recorder :activated="activated" /></TabContent>
          </TabGroup>
        `
      });
      expect(activatedOnSetup).toEqual([false]);
    });

    it('overlays the default loading indicator while setLoading(true)', async () => {
      const wrapper = mount({
        components: { TabGroup, TabContent },
        template: `
          <TabGroup>
            <TabContent v-slot="{ setLoading }" label-id="a" description="Basic">
              <button class="start" @click="setLoading(true)" />
              <button class="stop" @click="setLoading(false)" />
            </TabContent>
          </TabGroup>
        `
      });
      const content = () => wrapper.find('.dwui-tab-content');
      await wrapper.find('.start').trigger('click');
      expect(content().attributes('aria-busy')).toBe('true');
      expect(content().find('.dwui-tab-loading .dwui-tab-loading-spinner').exists()).toBe(true);
      await wrapper.find('.stop').trigger('click');
      expect(content().attributes('aria-busy')).toBeUndefined();
      expect(content().find('.dwui-tab-loading').exists()).toBe(false);
    });

    it('overlays the #loading slot of TabGroup instead of the default indicator', async () => {
      const wrapper = mount({
        components: { TabGroup, TabContent },
        template: `
          <TabGroup>
            <template #loading><span class="custom-loading" /></template>
            <TabContent v-slot="{ setLoading }" label-id="a" description="Basic">
              <button class="start" @click="setLoading(true)" />
            </TabContent>
          </TabGroup>
        `
      });
      await wrapper.find('.start').trigger('click');
      expect(wrapper.find('.dwui-tab-loading .custom-loading').exists()).toBe(true);
      expect(wrapper.find('.dwui-tab-loading-spinner').exists()).toBe(false);
    });
  });

  describe('ssr', () => {
    it('renders the headers on the server when teleport is not given', async () => {
      const app = createSSRApp({
        render: () => h(TabGroup, null, {
          default: () => [h(TabContent, { labelId: 'a', description: 'Basic' }, () => 'A')]
        })
      });
      const html = await renderToString(app);
      expect(html).toMatch(/<label[^>]*class="dwui-tab-item[^"]*"[^>]*>[\s\S]*Basic[\s\S]*<\/label>/);
    });
  });

  describe('attributes', () => {
    it('applies class and style to the root of TabGroup', () => {
      const wrapper = mount(TabGroup, { attrs: { class: 'member-detail', style: 'width: 100%;' } });
      expect(wrapper.classes()).toEqual(expect.arrayContaining(['dwui-tab-group', 'member-detail']));
      expect(wrapper.attributes('style')).toContain('width: 100%');
    });
  });
});
