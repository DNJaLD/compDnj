<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="商品名称" prop="productName">
        <el-select v-model="queryParams.productName" placeholder="请选择商品名称" clearable>
          <el-option v-for="dict in dict.type.product_name" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="仓库名" prop="stortageName">
        <el-select v-model="queryParams.stortageName" placeholder="请选择仓库名" clearable>
          <el-option v-for="dict in dict.type.stortage_name" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['ruoyi-demo:getstorage:add']">新增</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['ruoyi-demo:getstorage:edit']">修改</el-button>
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['ruoyi-demo:getstorage:remove']">删除</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['ruoyi-demo:getstorage:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="getstorageList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="商品名称" align="center" prop="productName">
        <!-- <template slot-scope="scope">
          <dict-tag :options="dict.type.product_name" :value="scope.row.productName"/>
        </template> -->
      </el-table-column>
      <el-table-column label="商品数量" align="center" prop="productNumber" />
      <el-table-column label="仓库名" align="center" prop="stortageName">
        <!-- <template slot-scope="scope">
          <dict-tag :options="dict.type.stortage_name" :value="scope.row.stortageName"/>
        </template> -->
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['ruoyi-demo:getstorage:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['ruoyi-demo:getstorage:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 修改chuku对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="商品名称" prop="productName">
          <el-select v-model="form.productName" placeholder="请选择商品名称">
            <el-option v-for="dict in dict.type.product_name" :key="dict.value" :label="dict.label"
              :value="dict.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="仓库名" prop="stortageName">
          <el-select v-model="form.stortageName" placeholder="请选择仓库名">
            <el-option v-for="dict in dict.type.stortage_name" :key="dict.value" :label="dict.label"
              :value="dict.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="出库数量" prop="productNumer">
          <el-input v-model="form.productNumber" placeholder="请输入商品数量" />
        </el-form-item>

        <el-form-item prop="allNumber">
        </el-form-item>

        <el-form-item prop="id">
        </el-form-item>

        <el-tag>该仓库的所有商品数量：{{ form.allNumber }}</el-tag>


        <el-tag>该仓库商品单价：{{ form.productPrice }}</el-tag>


        <el-tag>该仓库商品金额：{{ form.money }}</el-tag>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm1">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>


    <!-- 查詢出庫單信息 -->
    <el-dialog :title="title" :visible.sync="openadd" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="商品名称" prop="productName">
          <el-select v-model="form.productName" placeholder="请选择商品名称">
            <el-option v-for="dict in dict.type.product_name" :key="dict.value" :label="dict.label"
              :value="dict.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="仓库名" prop="stortageName">
          <el-select v-model="form.stortageName" placeholder="请选择仓库名">
            <el-option v-for="dict in dict.type.stortage_name" :key="dict.value" :label="dict.label"
              :value="dict.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="出库数量" prop="productNumer">
          <el-input v-model="form.productNumber" placeholder="请输入商品数量" />
        </el-form-item>


      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm1">确 定</el-button>
        <el-button @click="canceladd">取 消</el-button>
      </div>
    </el-dialog>


    <!-- 添加出庫單 -->
    <el-dialog :title="title" :visible.sync="openaddinfo" width="500px" append-to-body>

      

      <el-form ref="forms,form"   :model="forms" label-width="80px">
      
        <!-- v-if="forms.allNumber != null && forms.productPrice != null && forms.money != null"> -->

        <el-form-item label="商品名称" prop="productName">
          <el-input v-model="form.productName" placeholder="请输入商品数量" />
        </el-form-item>
        <el-form-item label="仓库名" prop="stortageName">
          <el-input v-model="form.stortageName" placeholder="请输入商品数量" />
        </el-form-item>
        <el-form-item label="出库数量" prop="oldProductNumber">
          <el-input v-model="forms.oldProductNumber" placeholder="请输入商品数量" />
        </el-form-item>

        <el-tag>该仓库的所有商品数量：{{ forms.allNumber }}</el-tag>


        <el-tag>该仓库商品单价：{{ forms.productPrice }}</el-tag>


        <el-tag>该仓库商品金额：{{ forms.money }}</el-tag>
      </el-form>
      <!-- <el-form ref="forms" :model="forms" :rules="rules" label-width="80px" >

        <el-tag v-if="forms.allNumber < forms.productNumber">该仓库的沒有這麽多商品数量</el-tag>

      </el-form> -->

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm2">确 定</el-button>
        <el-button @click="canceladdinfo">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listGetstorage, getGetstorage, delGetstorage, addGetstorage, updateGetstorage ,getGetstorageInfo} from "@/api/ruoyi-demo/getstorage";

export default {
  name: "Getstorage",
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
      // chuku表格数据
      getstorageList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      openadd: false,
      openaddinfo: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        productName: null,
        stortageName: null
      },
      // 表单参数
      form: {},
      forms: {},
      // 表单校验
      rules: {
        productName: [
          { required: true, message: "商品名称不能为空", trigger: "change" }
        ],
        productNumber: [
          { required: true, message: "商品数量不能为空", trigger: "blur" }
        ],
        stortageName: [
          { required: true, message: "仓库名不能为空", trigger: "change" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询chuku列表 */
    getList() {
      this.loading = true;
      listGetstorage(this.queryParams).then(response => {
        this.getstorageList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    canceladd() {
      this.openadd = false;
      this.reset();
    },
    canceladdinfo() {
      this.openaddinfo = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        productName: null,
        productNumber: null,
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
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.openadd = true;
      this.title = "添加chuku";
      location.reload()
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getGetstorage(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改chuku";
      });
    },
    /** 提交按钮 */

    submitForm1() {
      this.$refs["form"].validate(valid => {
        if (valid) {
        
          if (this.form.id != null) {
            updateGetstorage(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
              location.reload()
            });
          } else {
            getGetstorageInfo(this.form).then(response => {      
              this.forms=response.data ;      
              this.openadd=false;
              this.openaddinfo=true     
              this.$modal.msgSuccess("查詢");
            });
          }
        }
      });
    },
    submitForm2() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          addGetstorage(this.form).then(response => {
            console.log("111111111");
            this.openaddinfo = false;
            this.$modal.msgSuccess("添加");
            this.getList();
            location.reload()
          });

        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除chuku编号为"' + ids + '"的数据项？').then(function () {
        return delGetstorage(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
        location.reload();
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('ruoyi-demo/getstorage/export', {
        ...this.queryParams
      }, `getstorage_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
