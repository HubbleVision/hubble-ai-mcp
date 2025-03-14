import { ChartService } from "../services/chartService.js";
import fs from "fs/promises";
import path from "path";
import axios from "axios";

/**
 * 测试 QuickChart 的各种图表类型
 */
async function testQuickChart() {
  try {
    console.log("开始测试 QuickChart...");
    
    // 创建输出目录
    const outputDir = path.resolve(process.cwd(), "chart-outputs");
    try {
      await fs.mkdir(outputDir, { recursive: true });
      console.log(`输出目录创建成功: ${outputDir}`);
    } catch (err) {
      console.log(`输出目录已存在: ${outputDir}`);
    }
    
    // 测试柱状图
    await testBarChart(outputDir);
    
    // 测试折线图
    await testLineChart(outputDir);
    
    // 测试饼图
    await testPieChart(outputDir);
    
    // 测试雷达图
    await testRadarChart(outputDir);
    
    // 测试仪表盘
    await testGaugeChart(outputDir);
    
    console.log("QuickChart 测试完成！所有图表已保存到:", outputDir);
  } catch (error) {
    console.error("测试过程中发生错误:", error);
  }
}

/**
 * 测试柱状图
 */
async function testBarChart(outputDir: string) {
  const config = ChartService.generateChartConfig({
    type: "bar",
    title: "月度销售数据",
    labels: ["一月", "二月", "三月", "四月", "五月", "六月"],
    datasets: [
      {
        label: "2024年",
        data: [65, 59, 80, 81, 56, 55],
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgb(54, 162, 235)",
      },
      {
        label: "2023年",
        data: [28, 48, 40, 19, 86, 27],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgb(255, 99, 132)",
      }
    ],
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
  
  const url = await ChartService.generateChartUrl(config);
  console.log("柱状图 URL:", url);
  
  const outputPath = path.join(outputDir, "bar-chart.png");
  await downloadImage(url, outputPath);
  console.log("柱状图已保存到:", outputPath);
}

/**
 * 测试折线图
 */
async function testLineChart(outputDir: string) {
  const config = ChartService.generateChartConfig({
    type: "line",
    title: "网站访问量趋势",
    labels: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
    datasets: [
      {
        label: "访问量",
        data: [1500, 1800, 2100, 1700, 2300, 2800, 3200],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.4
      }
    ]
  });
  
  const url = await ChartService.generateChartUrl(config);
  console.log("折线图 URL:", url);
  
  const outputPath = path.join(outputDir, "line-chart.png");
  await downloadImage(url, outputPath);
  console.log("折线图已保存到:", outputPath);
}

/**
 * 测试饼图
 */
async function testPieChart(outputDir: string) {
  const config = ChartService.generateChartConfig({
    type: "pie",
    title: "市场份额",
    labels: ["产品A", "产品B", "产品C", "产品D", "产品E"],
    datasets: [
      {
        data: [35, 25, 20, 15, 5],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)"
        ],
        borderWidth: 1
      }
    ]
  });
  
  const url = await ChartService.generateChartUrl(config);
  console.log("饼图 URL:", url);
  
  const outputPath = path.join(outputDir, "pie-chart.png");
  await downloadImage(url, outputPath);
  console.log("饼图已保存到:", outputPath);
}

/**
 * 测试雷达图
 */
async function testRadarChart(outputDir: string) {
  const config = ChartService.generateChartConfig({
    type: "radar",
    title: "技能评估",
    labels: ["编程", "设计", "沟通", "团队协作", "问题解决", "创新"],
    datasets: [
      {
        label: "员工A",
        data: [85, 70, 90, 80, 75, 65],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgb(255, 99, 132)",
        pointBackgroundColor: "rgb(255, 99, 132)"
      },
      {
        label: "员工B",
        data: [65, 90, 75, 95, 85, 90],
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgb(54, 162, 235)",
        pointBackgroundColor: "rgb(54, 162, 235)"
      }
    ]
  });
  
  const url = await ChartService.generateChartUrl(config);
  console.log("雷达图 URL:", url);
  
  const outputPath = path.join(outputDir, "radar-chart.png");
  await downloadImage(url, outputPath);
  console.log("雷达图已保存到:", outputPath);
}

/**
 * 测试仪表盘
 */
async function testGaugeChart(outputDir: string) {
  const config = ChartService.generateChartConfig({
    type: "radialGauge",
    title: "性能指标",
    datasets: [
      {
        data: [75],
        backgroundColor: [
          "green", "yellow", "red"
        ]
      }
    ],
    options: {
      plugins: {
        datalabels: {
          display: true,
          formatter: (value: number) => value + '%'
        }
      },
      needle: {
        radiusPercentage: 2,
        widthPercentage: 3.2,
        lengthPercentage: 80,
        color: 'rgba(0, 0, 0, 1)'
      },
      valueLabel: {
        display: true,
        fontSize: 25,
        color: '#000',
        backgroundColor: 'rgba(0, 0, 0, 0)',
        bottomMarginPercentage: 5
      }
    }
  });
  
  const url = await ChartService.generateChartUrl(config);
  console.log("仪表盘 URL:", url);
  
  const outputPath = path.join(outputDir, "gauge-chart.png");
  await downloadImage(url, outputPath);
  console.log("仪表盘已保存到:", outputPath);
}

/**
 * 下载图片到指定路径
 */
async function downloadImage(url: string, outputPath: string): Promise<void> {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    await fs.writeFile(outputPath, response.data);
  } catch (error) {
    console.error(`下载图片失败 (${url}):`, error);
    throw error;
  }
}

// 运行测试
testQuickChart();
