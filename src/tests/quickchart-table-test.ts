import axios from "axios";
import fs from "fs/promises";
import path from "path";

/**
 * 测试 QuickChart 的表格 API
 */
async function testQuickChartTable() {
  try {
    console.log("开始测试 QuickChart 表格 API...");
    
    // 创建输出目录
    const outputDir = path.resolve(process.cwd(), "chart-outputs");
    try {
      await fs.mkdir(outputDir, { recursive: true });
      console.log(`输出目录创建成功: ${outputDir}`);
    } catch (err) {
      console.log(`输出目录已存在: ${outputDir}`);
    }
    
    // 测试基本表格
    await testBasicTable(outputDir);
    
    // 测试自定义样式表格
    await testStyledTable(outputDir);
    
    console.log("QuickChart 表格测试完成！所有表格已保存到:", outputDir);
  } catch (error) {
    console.error("测试过程中发生错误:", error);
  }
}

/**
 * 测试基本表格
 */
async function testBasicTable(outputDir: string) {
  const tableData = {
    title: "产品销售数据",
    columns: [
      {
        title: "产品名称",
        dataIndex: "product"
      },
      {
        title: "销售量",
        dataIndex: "sales",
        align: "right"
      },
      {
        title: "价格",
        dataIndex: "price",
        align: "right"
      }
    ],
    dataSource: [
      {
        product: "产品 A",
        sales: 120,
        price: "¥ 199"
      },
      {
        product: "产品 B",
        sales: 85,
        price: "¥ 299"
      },
      {
        product: "产品 C",
        sales: 65,
        price: "¥ 399"
      }
    ]
  };
  
  const url = `https://api.quickchart.io/v1/table?data=${encodeURIComponent(JSON.stringify(tableData))}`;
  console.log("基本表格 URL:", url);
  
  const outputPath = path.join(outputDir, "basic-table.png");
  await downloadImage(url, outputPath);
  console.log("基本表格已保存到:", outputPath);
}

/**
 * 测试自定义样式表格
 */
async function testStyledTable(outputDir: string) {
  const tableData = {
    title: "季度财务报表",
    columns: [
      {
        width: 150,
        title: "季度",
        dataIndex: "quarter"
      },
      {
        width: 120,
        title: "收入",
        dataIndex: "revenue",
        align: "right"
      },
      {
        width: 120,
        title: "支出",
        dataIndex: "expenses",
        align: "right"
      },
      {
        width: 120,
        title: "利润",
        dataIndex: "profit",
        align: "right"
      }
    ],
    dataSource: [
      "-",
      {
        quarter: "第一季度",
        revenue: "¥ 150,000",
        expenses: "¥ 70,000",
        profit: "¥ 80,000"
      },
      {
        quarter: "第二季度",
        revenue: "¥ 180,000",
        expenses: "¥ 85,000",
        profit: "¥ 95,000"
      },
      {
        quarter: "第三季度",
        revenue: "¥ 210,000",
        expenses: "¥ 95,000",
        profit: "¥ 115,000"
      },
      {
        quarter: "第四季度",
        revenue: "¥ 250,000",
        expenses: "¥ 110,000",
        profit: "¥ 140,000"
      },
      "-",
      {
        quarter: "总计",
        revenue: "¥ 790,000",
        expenses: "¥ 360,000",
        profit: "¥ 430,000"
      }
    ]
  };
  
  const options = {
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: "#f5f5f5",
    fontFamily: "sans-serif"
  };
  
  // 使用 POST 请求
  const outputPath = path.join(outputDir, "styled-table.png");
  await generateTableWithPost(tableData, options, outputPath);
  console.log("自定义样式表格已保存到:", outputPath);
}

/**
 * 使用 POST 请求生成表格
 */
async function generateTableWithPost(data: any, options: any, outputPath: string): Promise<void> {
  try {
    const response = await axios.post(
      "https://api.quickchart.io/v1/table",
      { data, options },
      { responseType: "arraybuffer" }
    );
    await fs.writeFile(outputPath, response.data);
    console.log("使用 POST 请求生成表格成功");
  } catch (error) {
    console.error("使用 POST 请求生成表格失败:", error);
    throw error;
  }
}

/**
 * 下载图片到指定路径
 */
async function downloadImage(url: string, outputPath: string): Promise<void> {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    await fs.writeFile(outputPath, response.data);
  } catch (error) {
    console.error(`下载图片失败 (${url}):`, error);
    throw error;
  }
}

// 运行测试
testQuickChartTable();
