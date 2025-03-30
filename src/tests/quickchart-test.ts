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

    // 测试环形图
    await testDoughnutChart(outputDir);

    // 测试散点图
    await testScatterChart(outputDir);

    // 测试气泡图
    await testBubbleChart(outputDir);

    // 测试堆叠柱状图
    await testStackedBarChart(outputDir);
    
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
 * 测试环形图
 */
async function testDoughnutChart(outputDir: string) {
  const config = ChartService.generateChartConfig({
    type: "doughnut",
    title: "收入来源分布",
    labels: ["在线销售", "实体店", "代理商", "其他渠道"],
    datasets: [{
      data: [45, 25, 20, 10],
      backgroundColor: [
        "rgba(255, 99, 132, 0.8)",
        "rgba(54, 162, 235, 0.8)",
        "rgba(255, 206, 86, 0.8)",
        "rgba(75, 192, 192, 0.8)"
      ],
      borderWidth: 1
    }],
    options: {
      cutout: '60%',
      plugins: {
        legend: {
          position: 'right'
        }
      }
    }
  });

  const url = await ChartService.generateChartUrl(config);
  console.log("环形图 URL:", url);
  
  const outputPath = path.join(outputDir, "doughnut-chart.png");
  await downloadImage(url, outputPath);
  console.log("环形图已保存到:", outputPath);
}

/**
 * 测试散点图
 */
async function testScatterChart(outputDir: string) {
  const config = ChartService.generateChartConfig({
    type: "scatter",
    title: "身高体重分布",
    datasets: [{
      label: "男性",
      data: [
        { x: 170, y: 65 },
        { x: 175, y: 70 },
        { x: 180, y: 75 },
        { x: 165, y: 60 },
        { x: 185, y: 80 }
      ],
      backgroundColor: "rgba(54, 162, 235, 0.5)"
    }, {
      label: "女性",
      data: [
        { x: 160, y: 50 },
        { x: 165, y: 55 },
        { x: 170, y: 60 },
        { x: 155, y: 45 },
        { x: 175, y: 65 }
      ],
      backgroundColor: "rgba(255, 99, 132, 0.5)"
    }],
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: '身高 (cm)'
          }
        },
        y: {
          title: {
            display: true,
            text: '体重 (kg)'
          }
        }
      }
    }
  });

  const url = await ChartService.generateChartUrl(config);
  console.log("散点图 URL:", url);
  
  const outputPath = path.join(outputDir, "scatter-chart.png");
  await downloadImage(url, outputPath);
  console.log("散点图已保存到:", outputPath);
}

/**
 * 测试气泡图
 */
async function testBubbleChart(outputDir: string) {
  const config = ChartService.generateChartConfig({
    type: "bubble",
    title: "城市数据分析",
    datasets: [{
      label: "城市指标",
      data: [
        { x: 80, y: 75, r: 20 },  // GDP, 生活质量, 人口
        { x: 65, y: 85, r: 15 },
        { x: 90, y: 65, r: 25 },
        { x: 70, y: 90, r: 10 }
      ],
      backgroundColor: [
        "rgba(255, 99, 132, 0.5)",
        "rgba(54, 162, 235, 0.5)",
        "rgba(255, 206, 86, 0.5)",
        "rgba(75, 192, 192, 0.5)"
      ]
    }],
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: 'GDP指数'
          }
        },
        y: {
          title: {
            display: true,
            text: '生活质量指数'
          }
        }
      }
    }
  });

  const url = await ChartService.generateChartUrl(config);
  console.log("气泡图 URL:", url);
  
  const outputPath = path.join(outputDir, "bubble-chart.png");
  await downloadImage(url, outputPath);
  console.log("气泡图已保存到:", outputPath);
}

/**
 * 测试堆叠柱状图
 */
async function testStackedBarChart(outputDir: string) {
  const config = ChartService.generateChartConfig({
    type: "bar",
    title: "季度销售构成",
    labels: ["Q1", "Q2", "Q3", "Q4"],
    datasets: [
      {
        label: "产品A",
        data: [300, 400, 350, 500],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "产品B",
        data: [200, 300, 400, 450],
        backgroundColor: "rgba(54, 162, 235, 0.5)",
      },
      {
        label: "产品C",
        data: [100, 200, 300, 350],
        backgroundColor: "rgba(255, 206, 86, 0.5)",
      }
    ],
    options: {
      scales: {
        x: {
          stacked: true
        },
        y: {
          stacked: true,
          beginAtZero: true
        }
      }
    }
  });

  const url = await ChartService.generateChartUrl(config);
  console.log("堆叠柱状图 URL:", url);
  
  const outputPath = path.join(outputDir, "stacked-bar-chart.png");
  await downloadImage(url, outputPath);
  console.log("堆叠柱状图已保存到:", outputPath);
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
