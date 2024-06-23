<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="仓库名" prop="storageName">
        <el-input
          v-model="queryParams.storageName"
          placeholder="请输入仓库名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商品名" prop="productName">
        <el-input
          v-model="queryParams.productName"
          placeholder="请输入商品名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商品id" prop="productId">
        <el-input
          v-model="queryParams.productId"
          placeholder="请输入商品id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商品数量" prop="prouctNumber">
        <el-input
          v-model="queryParams.prouctNumber"
          placeholder="请输入商品数量"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['ruoyi-demo:storage:add']"
        >新增</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['ruoyi-demo:storage:edit']"
        >修改</el-button>
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['ruoyi-demo:storage:remove']"
        >删除沒有商品的倉庫</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['ruoyi-demo:storage:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="storageList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="仓库名" align="center" prop="storageName" />
      <el-table-column label="商品名" align="center" prop="productName" />
      <el-table-column label="商品单价" align="center" prop="productPrice" />
      <el-table-column label="商品数量" align="center" prop="prouctNumber" />
      <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width"> -->
        <!-- <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['ruoyi-demo:storage:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['ruoyi-demo:storage:remove']"
          >删除</el-button>
        </template> -->
      <!-- </el-table-column> -->
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改cangku对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="仓库名" prop="storageName">
          <el-input v-model="form.storageName" placeholder="请输入仓库名" />
        </el-form-item>
        <el-form-item label="商品名" prop="productName">
          <el-input v-model="form.productName" placeholder="请输入商品名" />
        </el-form-item>
        <el-form-item label="商品id" prop="productId">
          <el-input v-model="form.productId" placeholder="请输入商品id" this.value="form.productId"/>
        </el-form-item>
        <el-form-item label="商品数量" prop="prouctNumber">
          <el-input v-model="form.prouctNumber" placeholder="请输入商品数量" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>


    <el-form :model="delecteStorage" ref="delecteStorage" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="倉庫名" prop="storageName">
        <el-input
          v-model="delecteStorage.storageName"
          placeholder="倉庫名"
          aria-required="true"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleDelete">刪除</el-button>

      </el-form-item>   
    </el-form>
    

  </div>



</template>

<script>
import { listStorage, getStorage, delStorage, addStorage, updateStorage } from "@/api/ruoyi-demo/storage";

export default {
  name: "Storage",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // cangku表格数据
      storageList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        storageName: null,
        productName: null,
        productId: null,
        prouctNumber: null
      },
      //想刪除的倉庫名
      delecteStorage: {
        storageName:""
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        storageName: [
          { required: true, message: "仓库名不能为空", trigger: "blur" }
        ],
        // productName: [
        //   { required: true, message: "商品名不能为空", trigger: "blur" }
        // ],
        // productId: [
        //   { required: true, message: "商品id不能为空", trigger: "blur" }
        // ],
        // prouctNumber: [
        //   { required: true, message: "商品数量不能为空", trigger: "blur" }
        // ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询cangku列表 */
    getList() {
      this.loading = true;
      listStorage(this.queryParams).then(response => {
        this.storageList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        storageName: null,
        productName: null,
        productId: null,
        prouctNumber: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加cangku";
      location.reload();
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getStorage(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改cangku";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateStorage(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addStorage(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete() {
      const delName = this.delecteStorage.storageName ;
      this.$modal.confirm('是否确认删除沒有存商品的倉庫？'+"===="+delName).then(function() {
        //这里如果使用this会失效导致无法继续执行，因为回调函数中的this不是当前vue的实例
        // console.log(this.delecteStorage.storageName);
        // return delStorage(this.delecteStorage.storageName);
        return delStorage(delName);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('ruoyi-demo/storage/export', {
        ...this.queryParams
      }, `storage_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
