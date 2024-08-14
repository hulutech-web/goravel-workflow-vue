import { http } from "@/plugins/axios";
import router from "@/plugins/router";
import XEUtils from "xe-utils";
const storage = useStorage();

export default () => {
    // 方法
    const loadAttributes = async (id) => {
        return await http.request({
            url: `process/attribute?id=${id}`,
            method: "GET",
        });
    };

    //获取当前条件
    const getCurrCond=async(params)=>{
        return await http.request({
            url:`process/con`,
            method:"POST",
            data:params
        })
    }
    
    const updateProcess=async(id,data)=>{
        return await http.request({
            url:`process/${id}`,
            method:"PUT",
            data:data
        })
    }

    const deleteProcess=async(data)=>{
        return await http.request({
            url:`process/${data.id}`,
            method:"DELETE",
            data:{flow_id:data.flow_id}
        })
    }
    const serveApiUrl = import.meta.env.VITE_API_URL;
    const gridOptions = reactive<VxeGridProps<RowVO>>({
        border: "full",
        // size: "small",
        showHeaderOverflow: true,
        showOverflow: true,
        keepSource: true,
        autoResize: true,
        expandConfig: {
            trigger: "row",
            showIcon: true,
            expandRowKeys: [1, 2],
            iconOpen: "vxe-icon--caret-bottom",
            iconClose: "vxe-icon--caret-top",
        },
        formConfig: {
            titleWidth: 120,
            titleAlign: "right",
            items: [
                {
                    field: "flow_name",
                    title: "名称",
                    span: 6,
                    titlePrefix: {
                        useHTML: true,
                        message: "模糊查询",
                        icon: "vxe-icon-question-circle-fill",
                    },
                    itemRender: { name: "$input", props: { placeholder: "请输入名称" } },
                },
                {
                    span: 24,
                    align: "left",
                    collapseNode: true,
                    itemRender: {
                        name: "$buttons",
                        children: [
                            {
                                props: {
                                    type: "submit",
                                    content: "搜索",
                                    status: "primary",
                                },
                            },
                            { props: { type: "reset", content: "重置" } },
                        ],
                    },
                },
            ],
        },
        stripe: true,
        id: "full_edit_9999",
        rowConfig: {
            keyField: "#",
            isHover: true,
            useKey: true,
        },
        columnConfig: {
            resizable: true,
        },
        customConfig: {
            storage: true,
            checkMethod({ column }) {
                if (["name", "no"].includes(column.field)) {
                    return false;
                }
                return true;
            },
        },
        printConfig: {
            columns: [{ field: "name" }],
        },
        sortConfig: {
            trigger: "cell",
            remote: true,
        },
        filterConfig: {
            remote: true,
        },
        pagerConfig: {
            enabled: true,
            pageSize: 10,
            pageSizes: [5, 10, 15, 20, 50, 100, 200, 500, 1000],
        },

        toolbarConfig: {
            buttons: [
                // {code: "insert_actived", name: "快捷新增", status: "primary"},
                // {code: "delete", name: "直接删除", status: "danger"},
                // {code: "mark_cancel", name: "删除/取消"},
                // {
                //   code: "save",
                //   name: "快捷改价",
                //   status: "success",
                //   click: () => {
                //     console.log("save");
                //   },
                // },
            ],
            refresh: true, // 显示刷新按钮
            import: false, // 显示导入按钮
            export: true, // 显示导出按钮
            print: true, // 显示打印按钮
            zoom: true, // 显示全屏按钮
            custom: true, // 显示自定义列按钮
        },
        proxyConfig: {
            seq: true, // 启用动态序号代理，每一页的序号会根据当前页数变化
            sort: true, // 启用排序代理，当点击排序时会自动触发 query 行为
            filter: true, // 启用筛选代理，当点击筛选时会自动触发 query 行为
            form: true, // 启用表单代理，当点击表单提交按钮时会自动触发 reload 行为
            props: {
                // 对应响应结果 Promise<{ result: [], page: { total: 100 } }>
                result: "data", // 配置响应结果列表字段
                total: "total", // 配置响应结果总页数字段
            },
            // 只接收Promise，具体实现自由发挥
            ajax: {
                // 当点击工具栏查询按钮或者手动提交指令 query或reload 时会被触发
                query: ({ page, sorts, filters, form }) => {
                    return new Promise((resolve, reject) => {
                        const queryParams: any = Object.assign({}, form);
                        // 处理排序条件
                        const firstSort = sorts[0];
                        if (firstSort) {
                            queryParams.sort = firstSort.field;
                            queryParams.order = firstSort.order;
                        }
                        // 处理筛选条件
                        filters.forEach(({ field, values }) => {
                            queryParams[field] = values.join(",");
                        });

                        const data = http.request({
                            url: `flow?pageSize=${page.pageSize}&currentPage=${page.currentPage
                                }&${XEUtils.serialize(queryParams)}`,
                            method: "GET",
                        });
                        resolve(data);
                    });
                },
                save: ({ body }) => {
                    return new Promise((resolve, reject) => {
                        //删除item中的#字段
                        let postData = body.updateRecords.map(item => {
                            return {
                                id: item.ID,
                                price: +item.price
                            }
                        })
                        const data = batchUpdate(postData);
                        resolve(data);
                    });
                },
            },
        },
        columns: [
            { field: "id", title: "id", width: 100 },
            { field: "flow_no", title: "流程编号", width: 100 },
            // 配置日期选择器
            {
                field: "template_id",
                title: "模板ID",
                sortable: true,
            },
            {
                field: "flow_name",
                title: "流程名称",
                sortable: true,
            },
            {
                field: "jsplumb",
                title: "流程图数据",
            },
            {
                field: "type_id",
                title: "类型ID",
            },
            {
                field: "is_publish",
                title: "是否发布",
            },
            {
                field: "is_show",
                title: "是否显示",
            },
            {
                field: "action",
                title: "操作",
                slots: {
                    default: "action",
                },
            },
        ],
        importConfig: {},
        exportConfig: {},
        checkboxConfig: {
            labelField: "ID",
            checkStrictly: true,
        },
        editRules: {
            name: [
                { required: true, message: "必填" },
                { min: 3, max: 50, message: "名称长度在 3 到 50 个字符" },
            ],
            no: [{ required: true, message: "必填" }],
        },
        editConfig: {
            trigger: "click", // 设置为 'click' 表示点击单元格时自动进入编辑状态
            mode: "row",
            showStatus: true,
            showUpdateStatus: true,
            showInsertStatus: true,
            autoClear: true,
        },
    });
    return {
        gridOptions,
        getCurrCond,
        loadAttributes,
        deleteProcess,
        updateProcess
    };
};
