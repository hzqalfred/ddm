<template>
  <div class="config-container" style="height: 100%;overflow: auto;">
    <el-container>
      <el-main>
        <div class="config-form">
          <h2 class="config-title">初始化配置</h2>
          <div style="margin-bottom: 10px;">
            <el-button @click="submitConfig">保存配置</el-button>
            <el-button type="primary" @click="reloadConfig">重载配置</el-button>
          </div>
          <!-- 使用 el-collapse 代替 el-steps -->
          <el-collapse v-model="activeStep">
            <el-collapse-item title="主数据源配置" name="0">
              <el-button
                v-if="false"
                style="margin-bottom: 15px;"
                :type="mainDataSourceConnectionStatusType"
                @click="testMainDataSourceConnection"
              >
                {{ mainDataSourceConnectionStatus || "测试连接" }}
              </el-button>
              <el-form
                v-if="false"
                :model="dataSource.mainDataSource"
                label-width="120px"
                class="form-item"
              >
                <el-form-item label="数据库类型">
                  <el-select v-model="dataSource.mainDataSource.type">
                    <el-option label="mysql" value="mysql" />
                    <el-option label="oracle" value="oracle" />
                    <el-option label="dm8" value="dm8" />
                  </el-select>
                </el-form-item>
                <el-form-item label="IP地址">
                  <el-input
                    v-model="dataSource.mainDataSource.ip"
                    placeholder="请输入IP地址"
                  />
                </el-form-item>
                <el-form-item label="端口">
                  <el-input
                    v-model="dataSource.mainDataSource.port"
                    placeholder="请输入端口"
                  />
                </el-form-item>
                <el-form-item label="数据库名">
                  <el-input
                    v-model="dataSource.mainDataSource.schema"
                    placeholder="请输入数据库名"
                  />
                </el-form-item>
                <el-form-item label="用户名">
                  <el-input
                    v-model="dataSource.mainDataSource.username"
                    placeholder="请输入用户名"
                  />
                </el-form-item>
                <el-form-item label="密码">
                  <el-input
                    v-model="dataSource.mainDataSource.password"
                    placeholder="请输入密码"
                    type="password"
                  />
                </el-form-item>
              </el-form>
              <h3>
                数据源列表
                <el-button
                  style="margin-left: 12px;"
                  type="primary"
                  @click="addDataSource"
                  >添加数据源</el-button
                >
              </h3>
              <vxe-table
                ref="xTable"
                v-if="dataSource.dataSourceList.length > 0"
                :data="dataSource.dataSourceList"
                :edit-config="{
                  trigger: 'click',
                  mode: 'cell',
                  showStatus: true,
                }"
                style="width: 100%"
              >
                <vxe-column
                  field="type"
                  title="数据库类型"
                  :edit-render="{
                    name: 'VxeSelect',
                    options: [
                      { value: 'mysql', label: 'mysql' },
                      { value: 'oracle', label: 'oracle' },
                      { value: 'dm8', label: 'dm8' },
                    ],
                  }"
                />
                <vxe-column
                  field="name"
                  title="名称"
                  :edit-render="{ name: 'input' }"
                />
                <vxe-column
                  field="ip"
                  title="IP"
                  :edit-render="{ name: 'input' }"
                />
                <vxe-column
                  field="port"
                  title="端口"
                  :edit-render="{ name: 'input' }"
                />
                <vxe-column
                  field="schema"
                  title="数据库"
                  :edit-render="{ name: 'input' }"
                />
                <vxe-column
                  field="username"
                  title="用户名"
                  :edit-render="{ name: 'input' }"
                />
                <vxe-column
                  field="password"
                  title="密码"
                  :edit-render="{
                    name: 'VxeInput',
                    props: { type: 'password' },
                  }"
                >
                  <template #default="{ row }">
                    <div>{{ row.password?.replace(/./g, "*") }}</div>
                  </template>
                </vxe-column>
                <vxe-column width="150">
                  <template #default="{ row }">
                    <el-button
                      :type="
                        row.connectionStatus
                          ? row.connectionStatus == '成功'
                            ? 'success'
                            : 'danger'
                          : 'primary'
                      "
                      size="mini"
                      @click="testDataSourceConnection(row)"
                    >
                      {{ row.connectionStatus || "连接" }}
                    </el-button>
                  </template>
                </vxe-column>
                <vxe-column>
                  <template #default="{ row }">
                    <el-button
                      type="danger"
                      size="mini"
                      @click="removeDataSource(row)"
                      >删除</el-button
                    >
                  </template>
                </vxe-column>
              </vxe-table>
            </el-collapse-item>

            <!-- <el-collapse-item title="Redis配置" name="1">
              <el-button
                style="margin-bottom: 15px;"
                :type="redisConnectionStatusType"
                @click="testRedisConnection"
              >
                {{ redisConnectionStatus || "测试连接" }}
              </el-button>
              <el-form
                :model="dataSource.redis"
                label-width="120px"
                class="form-item"
              >
                <el-form-item label="Redis IP">
                  <el-input
                    v-model="dataSource.redis.ip"
                    placeholder="请输入Redis IP"
                  />
                </el-form-item>
                <el-form-item label="Redis端口">
                  <el-input
                    v-model="dataSource.redis.port"
                    placeholder="请输入Redis端口"
                  />
                </el-form-item>
                <el-form-item label="密码">
                  <el-input
                    v-model="dataSource.redis.password"
                    placeholder="请输入Redis密码"
                    type="password"
                  />
                </el-form-item>
                <el-form-item label="数据库">
                  <el-input
                    v-model="dataSource.redis.database"
                    placeholder="请输入Redis数据库"
                  />
                </el-form-item>
              </el-form>
            </el-collapse-item> -->

            <el-collapse-item title="文件上传配置" name="2">
              <el-button
                style="margin-bottom: 15px;"
                :type="FileUploadConnectionStatusType"
                @click="testFileUploadConnection"
              >
                {{ FileUploadConnectionStatus || "测试连接" }}
              </el-button>
              <el-form
                inline
                :model="dataSource.fileUpload"
                label-width="80px"
                class="form-item"
              >
                <el-form-item label="上传类型">
                  <el-select
                    style="width: 145px;"
                    v-model="dataSource.fileUpload.type"
                  >
                    <el-option label="local" value="local" />
                    <el-option label="ftp" value="ftp" />
                    <el-option label="oss" value="oss" />
                  </el-select>
                </el-form-item>
                <el-form-item label="基础路径">
                  <el-input
                    style="width: 145px;"
                    v-model="dataSource.fileUpload.basePath"
                    placeholder="请输入基础路径"
                  />
                </el-form-item>
                <el-form-item label="端口">
                  <el-input
                    style="width: 145px;"
                    v-model="dataSource.fileUpload.port"
                    placeholder="请输入端口"
                  />
                </el-form-item>
                <el-form-item label="用户名">
                  <el-input
                    style="width: 145px;"
                    v-model="dataSource.fileUpload.username"
                    placeholder="请输入用户名"
                  />
                </el-form-item>
                <el-form-item label="密码">
                  <el-input
                    style="width: 145px;"
                    v-model="dataSource.fileUpload.password"
                    placeholder="请输入密码"
                    type="password"
                  />
                </el-form-item>
              </el-form>
            </el-collapse-item>

            <el-collapse-item title="日志配置" name="3">
              <el-form
                inline
                :model="dataSource.log"
                label-width="80px"
                class="form-item"
              >
                <el-form-item label="日志路径">
                  <el-input
                    style="width: 290px;"
                    v-model="dataSource.log.path"
                    placeholder="请输入日志路径"
                  />
                </el-form-item>

                 <el-form-item label="数据归档">
                  <el-input
                    style="width: 290px;"
                    v-model="dataSource.log.dataSvrUrl"
                    placeholder="请输入数据归档日志服务URL"
                  />
                </el-form-item>
              </el-form>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import {
  getRuntimeSetting,
  saveRuntimeSetting,
  reloadRuntimeSetting,
  checkDataSourceConnection,
  checkRedisConnection,
  checkFileUploadConnection,
} from "@/api/init";
import {
  ElContainer,
  ElMain,
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElCollapse,
  ElCollapseItem,
} from "element-plus";
import messageHandler from "@/core/Message";
import { VxeUI } from "vxe-table";
import router from "@/core/components/WebHash/router";

// 创建 AuthManage 实例
const flag = router.currentRoute.path == "/setting" ? true : false;
const dataSource = ref({
  mainDataSource: {
    ip: "",
    port: "",
    schema: "",
    type: "",
    username: "",
    password: "",
  },
  dataSourceList: [],
  redis: {
    ip: "",
    port: "",
    password: "",
    database: "",
  },
  fileUpload: {
    type: "",
    basePath: "",
  },
  log: {
    path: "",
    dataSvrUrl:""
  },
});

const redisConnectionStatus = ref("");
const mainDataSourceConnectionStatus = ref("");
const FileUploadConnectionStatus = ref("");

// 当前步骤
const activeStep = ref(["0", "2", "3"]);

// 计算属性，根据连接状态返回按钮类型
const redisConnectionStatusType = computed(() => {
  const status = redisConnectionStatus.value;
  if (status) {
    return status === "成功" ? "success" : "danger";
  }
  return "primary";
});

const mainDataSourceConnectionStatusType = computed(() => {
  const status = mainDataSourceConnectionStatus.value;
  if (status) {
    return status === "成功" ? "success" : "danger";
  }
  return "primary";
});

const FileUploadConnectionStatusType = computed(() => {
  const status = FileUploadConnectionStatus.value;
  if (status) {
    return status === "成功" ? "success" : "danger";
  }
  return "primary";
});
onMounted(() => {
  getSetting();
});
const getSetting = () => {
  getRuntimeSetting().then((res) => {
    dataSource.value = res.data || dataSource.value;
    if (Object.keys(dataSource.value?.mainDataSource).length > 1) {
      if (
        dataSource.value.dataSourceList.length &&
        JSON.stringify(dataSource.value.dataSourceList[0]) ==
          JSON.stringify(dataSource.value.mainDataSource)
      ) {
        return;
      }
      dataSource.value.dataSourceList.unshift(dataSource.value?.mainDataSource);
    }
  });
};

// 添加数据源
const addDataSource = () => {
  dataSource.value.dataSourceList.push({
    ip: "",
    port: "",
    schema: "",
    type: "",
    username: "",
    password: "",
    name: "",
  });
};

// 测试连接方法
const testMainDataSourceConnection = async () => {
  mainDataSourceConnectionStatus.value = "正在测试...";
  try {
    const status = await checkDataSourceConnection(
      dataSource.value.mainDataSource
    );
    mainDataSourceConnectionStatus.value = status.success ? "成功" : "失败";
  } catch (error) {
    mainDataSourceConnectionStatus.value = "失败";
  }
};

const testDataSourceConnection = async (row) => {
  row.connectionStatus = "正在测试...";
  try {
    const status = await checkDataSourceConnection(row);
    row.connectionStatus = status.success ? "成功" : "失败";
  } catch (error) {
    row.connectionStatus = "失败";
  }
};

const testRedisConnection = async () => {
  redisConnectionStatus.value = "正在测试...";
  try {
    const status = await checkRedisConnection(dataSource.value.redis);
    redisConnectionStatus.value = status.success ? "成功" : "失败";
  } catch (error) {
    redisConnectionStatus.value = "失败";
  }
};
const testFileUploadConnection = async () => {
  FileUploadConnectionStatus.value = "正在测试...";
  try {
    const status = await checkFileUploadConnection(dataSource.value.fileUpload);
    FileUploadConnectionStatus.value = status.success ? "成功" : "失败";
  } catch (error) {
    FileUploadConnectionStatus.value = "失败";
  }
};
// 删除数据源
const removeDataSource = (row) => {
  VxeUI.modal.confirm({
    title: "删除确认",
    content: "是否确定删除数据源?",
    mask: false,
    lockView: false,
    onConfirm: () => {
      const index = dataSource.value.dataSourceList.indexOf(row);
      if (index > -1) {
        dataSource.value.dataSourceList.splice(index, 1);
      }
    },
  });
};

// 保存配置
const submitConfig = () => {
  if (dataSource.value.dataSourceList.length) {
    dataSource.value.mainDataSource = dataSource.value.dataSourceList.pop();
  }
  saveRuntimeSetting(dataSource.value).then(() => {
    messageHandler.notifySuccess("保存成功");
    getSetting();
  });
};

// 重载配置
const reloadConfig = () => {
  reloadRuntimeSetting(dataSource.value).then(() => {
    messageHandler.notifySuccess("重载成功");
    VxeUI.modal.confirm({
      title: "提示",
      content: "是否刷新当前页以实现配置重载并进入管理后台",
      draggable: false,
      onConfirm: () => {
        if(router.currentRoute.value.path.startsWith("/setting")){
          router.go(0)
        }else{
          router.push('/setting')
        }
      }
    });
  });
};
</script>

<style scoped>
.config-container {
  padding: 20px;
}

.config-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.form-item {
  margin-bottom: 20px;
}

.data-source-list {
  margin-bottom: 40px;
}

.el-table {
  margin-bottom: 20px;
}

.form-footer {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
