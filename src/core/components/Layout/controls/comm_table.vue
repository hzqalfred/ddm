<template>
  <div>
    <vxe-grid v-bind="gridOptions"></vxe-grid>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";

//属性
const props = defineProps(["attrs", "events"]);
// 模拟分页接口
const findPageList = (currentPage, pageSize) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      switch (props.attrs.source.type) {
        case "svr": //取数据中心
          break;
        case "list": //取自定义数据
          break;
        default:
          //
          throw "table 组件数据类型配置错误! 值[source.type:" +
            props.attrs.source.type +
            "]!";
      }
      if (props.attrs == "svr") {
      }
      const list = [
        {
          id: 10001,
          name: "Test1",
          nickname: "T1",
          role: "Develop",
          sex: "Man",
          age: 28,
          address: "Shenzhen",
        },
        {
          id: 10002,
          name: "Test2",
          nickname: "T2",
          role: "Test",
          sex: "Women",
          age: 22,
          address: "Guangzhou",
        },
        {
          id: 10003,
          name: "Test3",
          nickname: "T3",
          role: "PM",
          sex: "Man",
          age: 32,
          address: "Shanghai",
        },
        {
          id: 10004,
          name: "Test4",
          nickname: "T4",
          role: "Designer",
          sex: "Women",
          age: 23,
          address: "Shenzhen",
        },
        {
          id: 10005,
          name: "Test5",
          nickname: "T5",
          role: "Develop",
          sex: "Women",
          age: 30,
          address: "Shanghai",
        },
        {
          id: 10006,
          name: "Test6",
          nickname: "T6",
          role: "Designer",
          sex: "Women",
          age: 21,
          address: "Shenzhen",
        },
        {
          id: 10007,
          name: "Test7",
          nickname: "T7",
          role: "Test",
          sex: "Man",
          age: 29,
          address: "test abc",
        },
        {
          id: 10008,
          name: "Test8",
          nickname: "T8",
          role: "Develop",
          sex: "Man",
          age: 35,
          address: "Shenzhen",
        },
        {
          id: 10009,
          name: "Test9",
          nickname: "T9",
          role: "Develop",
          sex: "Man",
          age: 35,
          address: "Shenzhen",
        },
        {
          id: 100010,
          name: "Test10",
          nickname: "T10",
          role: "Develop",
          sex: "Man",
          age: 35,
          address: "Guangzhou",
        },
        {
          id: 100011,
          name: "Test11",
          nickname: "T11",
          role: "Test",
          sex: "Women",
          age: 26,
          address: "test abc",
        },
        {
          id: 100012,
          name: "Test12",
          nickname: "T12",
          role: "Develop",
          sex: "Man",
          age: 34,
          address: "Guangzhou",
        },
        {
          id: 100013,
          name: "Test13",
          nickname: "T13",
          role: "Test",
          sex: "Women",
          age: 22,
          address: "Shenzhen",
        },
      ];
      resolve({
        page: {
          total: list.length,
        },
        result: list.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize
        ),
      });
    }, 1000);
  });
};

const mergeCells = ref([
  { row: 1, col: 2, rowspan: 3, colspan: 1 },
  { row: 1, col: 3, rowspan: 2, colspan: 2 },
]);

const gridOptions = reactive({
  border: true,
  height: 530,
  rowConfig: {
    keyField: "id",
  },
  mergeCells: mergeCells,
  columnConfig: {
    resizable: props.attrs.resizable | false,
  },
  checkboxConfig: {
    reserve: true,
  },
  pagerConfig: {
    enabled: true,
    pageSize: 10,
  },
  columns: props.attrs.columns,
  proxyConfig: {
    seq: true,
    props: {
      result: "result",
      total: "page.total",
      attrs: "attrs",
    },
    ajax: {
      // 接收 Promise
      query: ({ page }) => {
        return findPageList(page.currentPage, page.pageSize);
      },
    },
  },
});
</script>
