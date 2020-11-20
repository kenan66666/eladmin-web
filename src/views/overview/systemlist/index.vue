<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.sysname" clearable size="small" placeholder="输入系统名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-input v-model="query.area" clearable size="small" placeholder="输入区域名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <date-range-picker v-model="query.createTime" class="date-item" />
        <el-select v-model="query.remark" clearable size="small" placeholder="状态" class="filter-item" style="width: 90px" @change="crud.toQuery">
          <el-option v-for="item in remarkTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
        <rrOperation />
      </div>
      <!--自封闭的子组件，闭合的/>之前要加一个空格-->
      <crudOperation :permission="permission" />
    </div>
    <!--表单组件-->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="600px">
      <!--ref=form是这个form组件的别名，通过别名指向这个dom元素，:model=form指的是form绑定的数据对象名-->
      <el-form ref="form" inline :model="form" :rules="rules" size="small" :label-position="labelPosition" label-width="320px">
        <el-form-item label="系统名称" prop="sysName" style="width: 370px;">
          <!--带上冒号的属性，=号后面赋值为变量，:相当于v-bind:。没有带冒号的属性，=号后面赋值为常量-->
          <systemName style="width: 150px;" :system-name-father="form.sysName" @getSysId="showSysId" />
          <!--隐藏的这个el-input写不写都行-->
          <!--
          <el-input type="hidden" v-model="form.sysName"></el-input>
          -->
        </el-form-item>
        <el-form-item label="系统编号" prop="sysId">
          <el-input v-model="form.sysId" style="width: 150px;" />
        </el-form-item>
        <el-form-item label="标题" prop="name">
          <el-input v-model="form.name" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="现象" prop="appear">
          <el-input v-model="form.appear" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="根本原因" prop="rootCause">
          <el-input v-model="form.rootCause" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="问题防范或经验教训总结" prop="solution">
          <el-input v-model="form.solution" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="状态" prop="enabled">
          <el-radio v-for="item in dict.dept_status" :key="item.id" v-model="form.enabled" :label="item.value">{{ item.label }}</el-radio>
        </el-form-item>
        <el-form-item label="上传" prop="fileList">
          <el-upload
            ref="upload"
            :limit="1"
            :before-upload="beforeUpload"
            :file-list="form.fileList"
            :auto-upload="false"
            :action="uploadUrl"
            :http-request="uploadAction"
            :on-change="onChange"
          >
            <div class="eladmin-upload"><i class="el-icon-upload" /> 添加文件</div>
            <div slot="tip" class="el-upload__tip">可上传任意格式文件，且不超过100M{{ fileUploadApiL }}</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button :loading="crud.status.cu === 2" type="primary" @click="upload">确认</el-button>
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table
      ref="table"
      v-loading="crud.loading"
      lazy
      :load="getDeptDatas"
      :data="crud.data"
    >
      <el-table-column label="系统名称" prop="sysName" width="270" />
      <el-table-column label="系统编号" prop="sysId" width="100" />
      <el-table-column label="所属区域" prop="area" width="120" />
      <el-table-column label="英文名称" prop="sysEnglishName" width="150" />
      <el-table-column prop="createTime" label="创建日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column v-permission="['admin','dept:edit','dept:del']" label="操作" width="130px" align="center" fixed="right">
        <template slot-scope="scope">
          <udOperation
            :data="scope.row"
            :permission="permission"
            :disabled-dle="scope.row.id === 1"
            msg="确定删除吗，此操作不能撤销！"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import crudDept from '@/api/overview/systemlist'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import systemName from '@/components/SystemName'
import DateRangePicker from '@/components/DateRangePicker'
import { mapGetters } from 'vuex'
import { upload2, upload3 } from '@/utils/upload'

// isTop是位于顶层的意思，没有pid。
const defaultForm = { id: null, name: null, isTop: '1', subCount: 0, pid: null, docDir: null, enabled: 'true' }
export default {
  name: 'Overview',
  components: { Treeselect, crudOperation, rrOperation, udOperation, DateRangePicker, systemName },
  cruds() {
    return CRUD({ title: '系统清单', url: 'api/overview/systemlist', crudMethod: { ...crudDept }})
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  // 设置数据字典
  dicts: ['dept_status'],
  data() {
    return {
      labelPosition: 'top',
      modelName: 'knowledge',
      pageName: 'lessonlearn',
      showVisible: false,
      uploadUrl: '',
      file: '',
      // headers: { 'Authorization': getToken() },
      depts: [],
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        docDir: [
          { required: true, message: '请输入重要度', trigger: 'blur', type: 'number' }
        ]
      },
      sform: {
        syssName: 'name1',
        name: 'name2',
        enabled: true
      },
      permission: {
        add: ['admin', 'dept:add'],
        edit: ['admin', 'dept:edit'],
        del: ['admin', 'dept:del']
      },
      remarkTypeOptions: [
        { key: 'true', display_name: '正常' },
        { key: 'false', display_name: '不再使用' }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'baseApi',
      'fileUploadApiL'
    ])
  },
  methods: {
    show(id) {
      this.showVisible = true
      const params = { id: id }
      crudDept.getDetail(params).then(res => {
        this.sform = res.content[0]
      })
    },
    showSysId(item) {
      console.log(JSON.stringify(item))
      // this.form.sysId = item.value
      this.$set(this.form, 'sysId', item.value)
      this.$set(this.form, 'sysName', item.label)
      console.log(JSON.stringify(this.form))
    },
    // 1.点击附件上传确认按钮时触发的函数，默认情况下(没有写http-request属性的情况下)，submit就触发了上传到后端的行为。
    // 2.在覆盖默认上传行为的情况下，upload的submit方法，应该是做了file对象和vue-upload组件
    // 的绑定，将上传的文件变为vue-upload组件的一个附加的对象。然后触发了http-request属性中的函数。
    upload() {
      console.log('upload函数执行到了')
      console.log(this.form.name)
      console.log(this.file)
      if (this.$refs['form']) {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            if (!this.file && this.file.size === 0 && !this.form.name) {
              this.$notify({
                title: '请填写名称或上传的文件',
                type: 'error',
                duration: 2500
              })
              return
            }
            // 有文件要上传时，执行submit，没有文件要上传时，执行submitCU
            if (this.file) {
              this.$refs.upload.submit()
            } else {
              this.crud.submitCU()
              console.log('submitCU已经执行到了')
            }
            console.log('submit已经执行完毕')
          }
        })
      }
    },
    // submit触发了el-upload组件的上传方法，el-upload有默认上传方法，也可以通过http-request来自定义上传方法，这个uploadAction就是自定义的上传方法。
    uploadAction() {
      console.log('uploadAction开始执行')
      console.log(this.file)
      var data = new FormData()
      data.append('file', this.file.raw)
      data.append('id', this.form.id)
      data.append('sysId', this.form.sysId)
      data.append('sysName', this.form.sysName)
      data.append('name', this.form.name)
      data.append('appear', this.form.appear)
      data.append('rootCause', this.form.rootCause)
      data.append('solution', this.form.solution)
      data.append('enabled', this.form.enabled)
      if (this.crud.status.add === 1) {
        upload2(this.fileUploadApiL, data)
          .then((res) => {
            this.loading = false
            if (res) {
              this.$notify({
                title: '上传成功',
                type: 'success',
                duration: 2500
              })
              this.cancel()
              this.$refs.upload.clearFiles()
              this.crud.status.add = CRUD.STATUS.NORMAL
              this.crud.status.cu = CRUD.STATUS.NORMAL
              this.crud.resetForm()
              this.crud.toQuery()
            } else {
              this.$notify({
                title: res,
                type: 'error',
                duration: 2500
              })
            }
          })
          .catch((err) => {
            this.loading = false
            this.$alert(err, '错误提示', {
              confirmButtonText: '确定',
              dangerouslyUseHTMLString: true
            })
          })
      } else if (this.crud.status.edit === 1) {
        upload3(this.fileUploadApiL, data)
          .then((res) => {
            this.loading = false
            if (res) {
              this.$notify({
                title: '上传成功',
                type: 'success',
                duration: 2500
              })
              this.cancel()
              this.$refs.upload.clearFiles()
              this.crud.status.edit = CRUD.STATUS.NORMAL
              this.crud.status.cu = CRUD.STATUS.NORMAL
              this.crud.resetForm()
              this.crud.toQuery()
            } else {
              this.$notify({
                title: res,
                type: 'error',
                duration: 2500
              })
            }
          })
          .catch((err) => {
            this.loading = false
            this.$alert(err, '错误提示', {
              confirmButtonText: '确定',
              dangerouslyUseHTMLString: true
            })
          })
      }
    },
    onChange(file, fileList) {
      if (fileList) {
        this.form.fileList = fileList.slice(-1)
      }
      // file文件对象来源于el-upload组件？
      this.file = file
    },
    cancel() {
      this.isUpload = false
      this.clearFile()
      this.form.fileList = []
    },
    clearFile() {
      const mainImg = this.$refs.upload
      if (mainImg && mainImg.length) {
        mainImg.forEach((item) => {
          // item.uploadFiles.length = 0;
          item.clearFiles()
        })
      }
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    getDeptDatas(tree, treeNode, resolve) {
      const params = { pid: tree.id }
      setTimeout(() => {
        crudDept.getDepts(params).then(res => {
          resolve(res.content)
        })
      }, 100)
    },
    // vue upload组件上传之前触发的函数
    beforeUpload(file) {
      let isLt2M = true
      isLt2M = file.size / 1024 / 1024 < 100
      if (!isLt2M) {
        this.loading = false
        this.$message.error('上传文件大小不能超过 100MB!')
      }
      return isLt2M
    },
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      // if (form.pid !== null) {
      //   form.isTop = '0'
      // } else if (form.id !== null) {
      //   form.isTop = '1'
      // }
      form.enabled = `${form.enabled}`
      if (form.id != null) {
        // 编辑时，执行这个操作
        this.getSupDepts(form.id)
      } else {
        // 新增时，执行这个操作
        this.getDepts()
      }
    },
    getSupDepts(id) {
      crudDept.getDeptSuperior(id).then(res => {
        const date = res.content
        // this.buildDepts(date)
        this.depts = date
      })
    },
    buildDepts(depts) {
      // 对拿到的所有部门的json数据，forEach每一个执行下面的操作
      // 把每一个有儿子，但是儿子又不存在的项的儿子字段置为空。
      depts.forEach(data => {
        if (data.children) {
          this.buildDepts(data.children)
        }
        if (data.hasChildren && !data.children) {
          data.children = null
        }
      })
    },
    getDepts() {
      crudDept.getDepts({ enabled: true }).then(res => {
        this.depts = res.content.map(function(obj) {
          if (obj.hasChildren) {
            obj.children = null
          }
          return obj
        })
      })
    },
    // 获取弹窗内部门数据
    loadDepts({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        crudDept.getDepts({ enabled: true, pid: parentNode.id }).then(res => {
          parentNode.children = res.content.map(function(obj) {
            if (obj.hasChildren) {
              obj.children = null
            }
            return obj
          })
          setTimeout(() => {
            callback()
          }, 100)
        })
      }
    },
    // 提交前的验证
    [CRUD.HOOK.afterValidateCU]() {
      if (this.form.name === null) {
        this.$message({
          message: '标题必须填写',
          type: 'warning'
        })
        return false
      }
      // 新建的或者说编辑的条目位于顶层，没有pid。
      // if (this.form.isTop === '1') {
      //   this.form.pid = null
      // }
      return true
    },
    // 改变状态
    changeEnabled(data, val) {
      this.$confirm('此操作将 "' + this.dict.label.dept_status[val] + '" ' + data.name + '部门, 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        crudDept.edit(data).then(res => {
          this.crud.notify(this.dict.label.dept_status[val] + '成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
        }).catch(err => {
          data.enabled = !data.enabled
          console.log(err.response.data.message)
        })
      }).catch(() => {
        data.enabled = !data.enabled
      })
    },
    checkboxT(row, rowIndex) {
      return row.id !== 1
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
 ::v-deep .vue-treeselect__control,::v-deep .vue-treeselect__placeholder,::v-deep .vue-treeselect__single-value {
    height: 30px;
    line-height: 30px;
  }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
 ::v-deep .el-input-number .el-input__inner {
    text-align: left;
  }
</style>
