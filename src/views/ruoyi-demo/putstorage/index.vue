<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="商品名" prop="productName">
        <el-input
          v-model="queryParams.productName"
          placeholder="请输入商品名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商品数量" prop="productNumber">
        <el-input
          v-model="queryParams.productNumber"
          placeholder="请输入商品数量"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="仓库库名" prop="stortageName">
        <el-input
          v-model="queryParams.stortageName"
          placeholder="请输入仓库库名"
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
          v-hasPermi="['ruoyi-demo:putstorage:add']"
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
          v-hasPermi="['ruoyi-demo:putstorage:edit']"
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
          v-hasPermi="['ruoyi-demo:putstorage:remove']"
        >删除</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['ruoyi-demo:putstorage:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="putstorageList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="商品名" align="center" prop="productName" />
      <el-table-column label="商品数量" align="center" prop="productNumber" />
      <el-table-column label="单价" align="center" prop="price" />
      <el-table-column label="金额" align="center" prop="money" />
      <el-table-column label="仓库库名" align="center" prop="stortageName" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['ruoyi-demo:putstorage:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['ruoyi-demo:putstorage:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加ruku对话框 -->
    <el-dialog :title="title" :visible.sync="openadd" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <!-- <el-form-item label="商品名" prop="productName">
          <el-input v-model="form.productName" placeholder="请输入商品名" />
        </el-form-item> -->
        <el-form-item label="商品名称" prop="productName">
          <el-select v-model="form.productName" placeholder="请选择商品名称">
            <el-option v-for="dict in dict.type.product_name" :key="dict.value" :label="dict.label"
              :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品数量" prop="productNumber">
          <el-input v-model="form.productNumber" placeholder="请输入商品数量" />
        </el-form-item>
        <el-form-item label="单价" prop="price">
          <el-input v-model="form.price" placeholder="请输入单价" />
        </el-form-item>
        <el-form-item label="金额" prop="money">
          <el-input v-model="form.money" placeholder="请输入金额" />
        </el-form-item>
        <!-- <el-form-item label="仓库库名" prop="stortageName">
          <el-input v-model="form.stortageName" placeholder="请输入仓库库名" />
        </el-form-item> -->
        <el-form-item label="仓库名" prop="stortageName">
          <el-select v-model="form.stortageName" placeholder="请选择仓库名">
            <el-option v-for="dict in dict.type.stortage_name" :key="dict.value" :label="dict.label"
              :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="canceladd">取 消</el-button>
      </div>
    </el-dialog>


    <!-- 修改ruku对话框 -->
    <el-dialog :title="title" :visible.sync="openedit" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="商品数量" prop="productNumber">
          <el-input v-model="form.productNumber" placeholder="请输入商品数量" />
        </el-form-item>
        <el-form-item label="单价" prop="price">
          <el-input v-model="form.price" placeholder="请输入单价" />
        </el-form-item>
        <el-form-item label="金额" prop="money">
          <el-input v-model="form.money" placeholder="请输入金额" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="canceledit">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listPutstorage, getPutstorage, delPutstorage, addPutstorage, updatePutstorage } from "@/api/ruoyi-demo/putstorage";

export default {
  name: "Putstorage",
  dicts: ['stortage_name', 'product_name'],
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
      // ruku表格数据
      putstorageList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      openadd: false,
      openedit: false,
      // 查询参数
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        productName: null,
        productNumber: null,
        stortageName: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        productName: [
          { required: true, message: "商品名不能为空", trigger: "blur" }
        ],
        productNumber: [
          { required: true, message: "商品数量不能为空", trigger: "blur" }
        ],
        price: [
          { required: true, message: "单价不能为空", trigger: "blur" }
        ],
        money: [
          { required: true, message: "金额不能为空", trigger: "blur" }
        ],
        stortageName: [
          { required: true, message: "仓库库名不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询ruku列表 */
    getList() {
      this.loading = true;
      listPutstorage(this.queryParams).then(response => {
        this.putstorageList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    canceladd() {
      this.openadd = false;
      this.reset();
    },
    canceledit() {
      this.openedit = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        productName: null,
        productNumber: null,
        price: null,
        money: null,
        stortageName: null
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
      this.openadd = true;
      this.title = "添加ruku";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getPutstorage(id).then(response => {
        this.form = response.data;
        this.openedit = true;
        this.title = "修改ruku";
      });
    },
    /** 提交按钮 */
    submitForm() {
      
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updatePutstorage(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.openedit = false;
              this.getList();
            });
          } else {
            addPutstorage(this.form).then(response => {  
              this.$modal.msgSuccess("新增成功");
              this.openadd = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除ruku编号为"' + ids + '"的数据项？').then(function() {
        return delPutstorage(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('ruoyi-demo/putstorage/export', {
        ...this.queryParams
      }, `putstorage_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
