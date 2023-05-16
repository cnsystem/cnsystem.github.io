---
title: 论文翻译LIO-SAM Tightly-coupled Lidar Inertial Odometry viaSmoothing and Mapping
author: cnsystem
layout: post
permalink: /LIO-SAM-Chinese.html
categories:
  - 论文翻译
tags:
  - SLAM
  - paper reading
---

**概要**:

我们提出了一种通过平滑和映射实现激光惯性测距仪紧密耦合的姿态估计框架LIO-SAM,可以实时准确地估计移动机器人的运动轨迹和创建地图。LIO-SAM在因子图的基础上表述了激光惯性测距仪的姿态估计,允许从不同源头将大量的相对测量和绝对测量(包括闭环)作为因子引入系统。从惯性测量单元(IMU)预积分获得的运动估计消除点云的失真,并为激光测距仪姿态优化提供初值。获得的激光测距仪解决方案用于估计IMU的偏差。为确保实时高性能,我们边缘化旧的激光扫描以进行姿态优化,而不是将激光扫描与全局地图匹配。与全局尺度相比,局部尺度的扫描匹配显著提高了系统的实时性能,关键帧的选择性引入和高效的滑动窗口方法(将新关键帧注册到固定大小的“子关键帧”集)也是如此。提出的方法在不同尺度和环境下从三个平台收集的数据集上进行了广泛评估。 

## I. INTRODUCTION

状态估计、定位和映射对移动机器人成功的智能化至关重要,它们是反馈控制、避障和规划等许多能力的基本先决条件。利用视觉感知和激光感知,已经投入了大量精力来实现支持移动机器人6DoF状态估计的高性能实时同步定位和映射(SLAM)。基于视觉的方法通常使用单目相机或立体相机,通过连续图像之间的三角测量来确定相机运动。虽然基于视觉的方法特别适合场景识别,但由于其易受初始化、照明和范围的影响,单独使用时无法可靠地支持自动导航系统。另一方面,基于激光的方法在很大程度上不受照明变化的影响。特别是随着Velodyne VLS-128和Ouster OS1-128等长距离、高分辨率3D激光雷达的出现,激光雷达更适合直接捕捉3D空间环境的细节。因此,本文重点关注基于激光的状态估计和映射方法。

在过去的二十年中,提出了许多基于激光的状态估计和映射方法。其中,在[1]中提出的激光测距仪姿态估计和映射(LOAM)方法用于低漂移和实时状态估计和映射,是最广泛使用的方法之一。LOAM使用激光测距仪和惯性测量单元(IMU),实现最先进的性能,自发布以来一直位列KITTI姿态基准网站[2]上基于激光的最高方法。尽管LOAM获得成功,但它存在一些限制——通过在全局体素地图中保存数据,难以执行闭环检测和纳入其他绝对测量(如GPS)进行姿态校正。在特征丰富的环境中,这种体素地图变得越来越密时,其在线优化过程的效率会降低。LOAM在大规模测试中也会出现漂移,因为在其核心它是一个基于扫描匹配的方法。 

在本文中,我们提出了一种通过平滑和映射实现激光惯性测距仪紧密耦合的姿态估计框架LIO-SAM,以解决上述问题。我们假设点云消失畸变的非线性运动模型,使用原始IMU测量估计激光扫描期间的传感器运动。除了消除点云畸变外,估计的运动还为激光测距仪姿态优化提供初值。然后,获得的激光测距仪解决方案用于在因子图中估计IMU的偏差。

通过引入全局因子图进行机器人运动轨迹估计,我们可以高效地利用激光和IMU测量值进行传感器融合,在机器人姿态之间进行场景识别,并在可用时引入绝对测量值,如GPS定位和罗盘方位。这些来自各种来源的因子用于对图进行联合优化。此外,我们边缘化旧的激光扫描以进行姿态优化,而不是像LOAM那样将扫描与全局地图匹配。与全局尺度相比,局部尺度的扫描匹配显著提高了系统的实时性能,关键帧的选择性引入和高效的滑动窗口方法(将新关键帧注册到固定大小的“子关键帧”集)也是如此。我们工作的主要贡献可以总结如下:

* 建立在因子图之上的紧密耦合的激光惯性测距仪框架,适用于多传感器融合和全局优化。
* 一个高效的、基于局部滑动窗口的扫描匹配方法,通过选择性选择新关键帧并将其注册到固定大小的先验子关键帧集,实现实时性能。
* 该框架在各种尺度、车辆和环境下进行了广泛验证。


## II. RELATED WORK

激光测距仪姿态估计通常通过使用ICP [3]和GICP [4]等扫描匹配方法找到两个连续帧之间的相对变换来完成。由于计算效率高,基于特征的匹配方法已经成为一种流行的替代方法。例如,在[5]中提出了一种基于平面匹配的方法进行实时激光测距仪姿态估计。假设在结构化环境中操作,它从点云中提取平面,并通过求解最小二乘问题匹配这些平面。在[6]中提出了一种基于collar line-based的方法进行姿态估计。在这种方法中,从原始点云中随机生成线段,并用于以后的配准。然而,由于现代3D激光雷达的旋转机构和传感器运动,激光扫描的点云经常会发生畸变。仅使用激光进行姿态估计并不理想,因为使用畸变的点云或特征进行配准最终会导致大的漂移。

因此,激光通常与其他传感器(如IMU和GPS)一起使用进行状态估计和映射。这种利用传感器融合的设计方案通常可以分为两类:松散耦合融合和紧密耦合融合。在LOAM [1]中,IMU用于消除激光扫描的畸变,并为扫描匹配提供运动先验。但是,IMU没有参与算法的优化过程。因此,LOAM可以归类为一种松散耦合方法。在[7]中提出了一种轻量级的用于地面车辆地图任务[8]的地面优化激光测距仪姿态估计和映射(LeGO-LOAM)方法。其IMU测量值的融合与LOAM相同。松散耦合融合的更流行的方法是使用扩展卡尔曼滤波器(EKF)。例如,[9][13]在机器人状态估计的优化阶段使用EKF融合来自激光、惯性和可选GPS的测量值。

紧密耦合的系统通常可以提供更高的精度,目前是正在进行研究的主要焦点[14]。在[15]中,利用预积分的IMU测量消除点云畸变。在[16]中提出了一种机器人中心的激光惯性状态估计器R-LINS。R-LINS使用误差状态Kalman滤波器以紧密耦合的方式递归纠正机器人的状态估计。由于缺乏用于状态估计的其他可用传感器,它在长时间导航中会出现漂移。在[17]中引入了一种紧密耦合的激光惯性测距仪姿态估计和映射框架LIOM。LIOM是LIO映射的缩写,它联合优化来自激光和IMU的测量值,与LOAM相比,其精度类似或更高。由于LIOM旨在处理所有传感器测量值,所以无法实现实时性能——在我们的测试中,其运行速度约为实时的0.6倍。

## III. LIDAR INERTIAL ODOMETRY VIA SMOOTHING AND MAPPING

### A. System Overview

我们首先定义整篇论文中使用的坐标系和符号。我们用W表示世界坐标系,B表示机器人体坐标系。为了方便,我们还假设IMU坐标系与机器人体坐标系重合。机器人状态x可以写成:

$$ 
x = [R^T, p^T, v^T, b^T]^T (1)
$$ 

其中R ∈ SO(3)是旋转矩阵,p ∈ $R^3$ 是位置向量,v是速度,b是IMU偏差。从B到W的变换T ∈ SE(3)表示为T = [R | p]。

![Fig.1](../images/2023/04/LIO-SAM-Figure1.jpg)

Fig. 1: The system structure of LIO-SAM. The system receives input from a 3D lidar, an IMU and optionally a GPS. Four types of factorsare introduced to construct the factor graph.: (a) IMU preintegration factor, (b) lidar odometry factor, (c) GPS factor, and (d) loop closurefactor. The generation of these factors is discussed in Section III.

该系统的概述如图1所示。该系统从3D激光雷达、IMU和可选的GPS接收传感器数据。我们的目标是利用这些传感器的观测值估计机器人的状态和其轨迹。这个状态估计问题可以表述为最大后验概率(MAP)问题。我们使用因子图来建模这个问题,因为与贝叶斯网相比,因子图更适合进行推理。假设高斯噪声模型,我们问题的MAP推理等同于求解非线性最小二乘问题[18]。
注意,在不失一般性的前提下,该系统也可以纳入其他传感器的测量,如高度计的高度或罗盘的方位。我们为构建因子图引入四种因子类型和一种变量类型。这个变量代表机器人在特定时间的状态,被分配到图的节点。四种因子类型为:

(a) IMU预积分因子,

(b) 激光测距仪姿态因子

(c) GPS因子

(d) 闭环因子。

当机器人姿态变化超过用户定义的阈值时,向图中添加新的机器人状态节点x。在插入新节点时,使用增量平滑和映射与贝叶斯树(iSAM2)[19]对因子图进行优化。
生成这些因子的过程在以下各节中描述。

### B. IMU预积分因子

IMU的角速度和加速度测量值使用公式2和3定义:

$$
\hat{w}_t = w_t + b^w_t + n^w_t (2) \\
\hat{a}_t = R^{BW}_t(a_t - g) + b^a_t + n^a_t (3) 
$$

其中 $\hat{w}_t$ 和 $\hat{a}_t$ 是时刻t在**B**(Body)坐标系中的原始IMU测量值。$\hat{w}_t$ 和 $\hat{a}_t$ 受缓慢变化的偏差 $b_t$ 和白噪声 $n_t$ 的影响。$R^{BW}_t$ 是从**W**（Wrold）坐标系到**B**（Body）坐标系的旋转矩阵。**g**是**W**（World）坐标系中的恒定重力向量。
我们现在可以使用IMU的测量值推断机器人的运动。机器人在时刻 $t + ∆t$ 的速度、位置和旋转可以计算如下:

$$ v_{t+∆t} = v_t + g∆t + R_t(\hat{a}_t − b^a_t − n^a_t )∆t(4) $$

$$ p_{t+∆t} = p_t + v_t∆t + \frac{1}{2}g∆t^2 + \frac{1}{2}R_t(\hat{a}_t − b^a_t − n^a_t )∆t^2(5) $$

$$ R_{t+∆t} = R_texp((\hat{w}_t - b^w_t - n^w_t )∆t),(6) $$

其中 

$$R_t = R^{WB}_t = R^{BW^T}_t$$ 

这里我们假设B的角速度和加速度在上述积分期间保持不变。
然后,我们应用[20]中提出的IMU预积分方法来获得两时间步之间的相对机体运动。在时刻i和j之间,预积分测量值 $∆v_{ij}$ 、$∆p_{ij}$ 和 $∆R_{ij}$ 可以使用下式计算:

$$∆v_{ij} = R^T_i (v_j − v_i − g∆t_{ij})   (7) $$

$$∆p_{ij} = R^T_i (p_j − p_i − v_i∆t_{ij} − \frac{1}{2}g∆t^2_{ij})(8) $$

$$∆R_{ij} = R^T_i R_j  (9)$$

由于空间限制,我们引用[20]中的描述,详细推导公式7和9。除了效率高外,应用IMU预积分还自然地给我们带来一种约束——IMU预积分因子。IMU偏差与因子图中的激光测距仪因子一起联合优化

### C. 激光测距仪姿态因子 

当接收到新激光扫描时,我们首先执行特征提取。通过评估局部区域内点的粗糙度来提取边缘和平面特征。粗糙度值较大的点被分类为边缘特征。类似地，由较小的粗糙度值被归类为平面特征。我们将在时刻i的激光扫描中提取的边缘和平面特征分别表示为 $F^e_i$ 和 $F^p_i$。

在时刻i提取的所有特征组成激光帧 $F_i$ ，其中 

$$F_i=\{F^e_i， F^p_i \}$$ 

注意，一个激光帧F表示为**B**(Body)坐标系下。特征提取过程的更详细描述可以在[1]或[7]中找到(如果使用距离图像)。

使用每个激光帧计算并添加因子到图中在计算上是不可行的，所以我们采用关键帧选择的概念，这在视觉SLAM领域广泛使用。使用简单但有效的启发法，当与前一状态$x_i$相比，机器人姿态的变化超过用户定义的阈值时，我们选择激光帧$F_{i+1}$作为关键帧。新保存的关键帧$F_{i+1}$与因子图中的新机器人状态节点$x_{i+1}$相关联。两个关键帧之间的激光帧被丢弃。这样添加关键帧不仅在地图密度和内存消耗之间达到平衡，而且有助于维持一个相对稀疏的因子图，这适合实时非线性优化。 
在我们的工作中，添加新关键帧的位置和旋转变化阈值分别选择为1米和10°。 

假设我们想要向因子图添加一个新状态节点$x_{i+1}$。与此状态相关联的激光关键帧是$F_{i+1}$。生成激光测距仪因子的步骤如下: 

1). 用于体素地图的子关键帧:

我们实现滑动窗口方法来创建包含固定数量最近激光扫描的点云地图。不是优化两个连续激光扫描之间的变换，我们提取n个最近的关键帧，我们称之为子关键帧，用于估计。子关键帧集合 
$$\{F_{i−n}， ...， F_i\}$$ 
然后使用与之关联的变换 
$$\{T_{i−n}， ...， T_i\}$$ 
转换到W坐标系下。转换后的子关键帧合并到体素地图$M_i$中。由于我们在前面的特征提取步骤中提取两种类型的特征，$M_i$由两个子体素地图组成，边缘特征体素地图${M^e_i}$ 和平面特征体素地图 ${M^p_i}$。激光帧和体素地图之间的关系如下:

$${M}_{i}=\{M_{i}^{e}， {M}_{i}^{p}\} $$

其中  

$${M}_{i}^{e}='F_{i}^{e} \cup'{F}_{i-1}^{e} \cup \ldots \cup '{F}_{i-n}^{e} $$

$${M}_{i}^{p} = '{F}_{i}^{p} \cup '{F}_{i-1}^{p} \cup \ldots \cup '{F}_{i-n}^{p} $$ 

$‘F^e_i$ 和 $‘F^p_i$ 是转换到W坐标系后的边缘和平面特征。$M_{i}^{e}$ 和 $M_{i}^{p}$ 然后下采样以消除落在同一个体素单元中的重复特征。在本文中，n被选择为25。 $M_{i}^{e}$ 和 $M_{i}^{p}$ 的下采样分辨率分别为0.2米和0.4米。 

2). 扫描匹配:

我们通过扫描匹配将新获得的激光帧$F_{i+1}$，也是$\{F^e_{i+1}， F^p_{i+1}\}$，与$M_i$匹配。可以利用各种扫描匹配方法，如[3]和[4]来完成此目的。这里我们选择[1]中的方法，因为其计算效率高和在各种困难环境下的鲁棒性。 
我们首先将$\{F^e_{i+1}， F^p_{i+1}\}$从B转换到W，得到$\{‘F^e_{i+1}， ‘F^p_{i+1}\}$。这个初始变换是使用来自 $ \widetilde{T}_{i+1}$ 得到的。对于 $‘F^e_{i+1}$ 或 $‘F^p_{i+1}$ 中的每个特征，我们然后在 $M_{i}^{e}$ 或 $M_{i}^{p}$ 中找到其边缘或平面对应项。为了简洁起见，这里省略了找到这些对应项的详细步骤，但在[1]中有详细描述。

3)相对变换:

特征与其边缘或平面补丁对应物之间的距离可以使用以下公式计算: 

$$
d_{e_k} = \frac
{| (p^e_{i+1,k} - p^e_{i,u}) \times (p^e_{i+1,k} - p^e_{i,v}) |}
{|  p^e_{i,u} -  p^e_{i,v} |} (10)\\


d_{p_k} = \frac
{|  (p^e_{i+1,k} - p^e_{i,u}) (p^e_{i,u} -  p^e_{i,v}) \times (p^e_{i,u} -  p^e_{i,w}) |}
{| (p^e_{i,u} -  p^e_{i,v}) \times (p^e_{i,u} -  p^e_{i,w}) |}
(11)
$$

这里 k,u,v 和 w 是匹配对集合中（ircorresponding sets)的特征索引(feature indices)。对于 $′F^e_{i+1}$ 中的边缘特征 $p^e_{i+1,k}$,$p^e_{i,u}$ 和 $p^e_{i,v}$ 是在 $M^e_i$ 中形成相应边缘线的点。对于 $′F^p_{i+1}$ 中的平面特征 $p^p_{i+1,k}$,$p^p_{i,u}, p^p_{i,v}$和$p^p_{i,w}$ 在$M^p_i$中形成相应的平面片。然后使用Gauss-Newton方法最小化能量函数来求解最佳变换: 


$$
\min_{T_{i+1}} 
\left \{ 
    \sum_{ {p^e_{i+1，k}} \in {′F^e_{i+1}}} {d_{e_k}} + \sum_{ p^p_{i+1，k} \in ′F^p_{i+1}}{d_{p_k}} 
\right \} 
$$

最终,我们可以获得 $x_i$和$x_{i+1}$ 之间的相对变换$∆T_{i,i+1}$，这是连接这两个姿态的激光测距仪里程计因子:

$$
∆T_{i,i+1} = T^T_i T_{i+1}(12) 
$$

我们注意到获得$∆T_{i,i+1}$的另一种方法是将子关键帧变换到$x_i$的坐标系中。换句话说,我们将$F_{i+1}$匹配到以$x_i$的坐标系表示的体素地图。通过这种方式,可以直接获得真实的相对变换$∆T_{i,i+1}$。因为变换后的特征$′F^e_i$和$′F^p_i$可以被多次重用,我们选择使用Sec III-C.1描述的方法,以提高计算效率。

### D. GPS Factor

尽管只利用IMU预积分和激光测距仪里程计因子可以获得可靠的状态估计和映射，但系统在长时间导航任务中仍会产生漂移。为解决这个问题，我们可以引入提供绝对测量的传感器来消除漂移。这样的传感器包括高度计、罗盘和GPS。为了说明问题,这里我们讨论GPS,因为它被广泛用于实际导航系统中。
当我们接收到GPS测量时,我们首先使用[21]中提出的方法将其变换到本地笛卡尔坐标系。在向因子图添加新节点时，我们随后将一个新的GPS因子与该节点关联。如果GPS信号与激光帧没有硬件同步，我们根据激光帧的时间戳线性插值GPS测量。


![Fig.2](../images/2023/04/LIO-SAM-Figure2.jpg)

Fig. 2: Datasets are collected on 3 platforms: (a) a custom-builthandheld device， (b) an unmanned ground vehicle - ClearpathJackal， (c) an electric boat - Duffy 21.

我们注意到，当有GPS接收时不必不断添加GPS因子，因为激光惯性里程计的漂移速度很慢。在实践中，我们只在估计位置协方差大于接收的GPS位置协方差时添加GPS因子。

### E. 闭环因子 

由于利用了因子图，闭环可以无缝地组合进所提出的系统。为了说明问题，我们描述并实现一种简单但有效的基于欧几里得距离的闭环检测方法。我们也注意到我们提出的框架与其他闭环检测方法兼容，如[22]和[23]，它们生成点云描述符并使用它进行场所识别。

当一个新状态 $x_{i+1}$ 被添加到因子图时，我们首先在图中搜索，找到在欧几里得空间中与$x_{i+1}$ 接近的先前状态。如图1所示,例如,$x_3$是返回的候选项之一。然后我们尝试使用扫描匹配将$F_{i+1}$与子关键帧$\{F_{3−m},...,F_3,...,F_{3+m}\}$匹配。请注意， $F_{i+1}$ 和过去的子关键帧首先被变换到W坐标系下，然后进行扫描匹配。我们获得相对变换$∆T_{3,i+1}$,并将其作为闭环因子添加到图中。在本文中,我们选择索引m为12,闭环的搜索距离从新状态 $x_{i+1}$ 为15米。

在实践中,我们发现添加闭环因子对于校正机器人的高度漂移特别有用,尤其是当GPS是唯一的绝对传感器时。这是因为GPS的高度测量非常不准确,在没有闭环的情况下,我们的测试中达到100米的高度误差。


## IV. EXPERIMENTS



我们现在描述一系列实验来定性和定量地分析我们提出的框架。本文使用的传感器套件包括Velodyne VLP16激光雷达、MicroStrain 3DM-GX5-25 IMU和Reach M GPS。为验证,我们在各种规模、平台和环境中收集了5个不同的数据集。这些数据集分别称为Rotation、Walking、Campus、Park和Amsterdam。传感器安装平台如图2所示。前三个数据集使用MIT校园定制的手持设备收集。Park数据集使用Clearpath Jackal无人地面车(UGV)在植被覆盖的公园收集。最后一个数据集Amsterdam通过在船上安装传感器并在阿姆斯特丹的运河上巡航来收集。这些数据集的详细信息见表I。

表I:数据集详细信息 

|数据集|扫描|高度变化(米)|轨迹长度(米)|最大旋转速度(◦/s) |
| ----|---|----------|-----------|----------------|
|Rotation|582|0|0|213.9|
|Walking|6502|0.3|801|133.7|
|Campus|9865|1.0|1437|124.8|
|Park|24691|19.0|2898|217.4|
|Amsterdam|107656|0|19065|17.2|

我们将提出的LIO-SAM框架与LOAM和LIOM进行比较。在所有的实验中，LOAM和LIO-SAM被强制实时运行。另一方面，LIOM被给予无限的时间来处理每个传感器测量。所有方法都是用C++实现的,在装有Intel i7-10710U CPU的笔记本电脑上使用机器人操作系统(ROS)[24]在Ubuntu 下执行。我们注意到仅使用CPU进行计算,没有启用并行计算。我们的LIO-SAM实现可在[Github](https://github.com/TixiaoShan/LIO-SAM)上免费获得。实验的补充细节,包括所有测试的完整可视化,

<iframe width="560" height="315" src="https://www.youtube.com/embed/A0H8CoORZJU" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
</iframe>

### A. Rotation数据集 

![Fig.3](../images/2023/04/LIO-SAM-Figure3.jpg)

图3:Rotation测试中LOAM和LIO-SAM的映射结果。LIOM无法产生有意义的结果。

在此测试中,我们主要评估当只向因子图中添加IMU预积分和激光测距仪里程计因子时,我们的框架的鲁棒性。Rotation数据集是通过用户手持传感器套件并在站立时执行一系列激进的旋转动作收集的。此测试中遇到的最大旋转速度为133.7°/s。测试环境中有许多结构,如图3(a)所示。LOAM和LIO-SAM获得的地图分别如图3(b)和(c)所示。因为LIOM使用来自[25]的相同初始化管道,它继承了视觉惯性SLAM的相同初始化敏感性,无法使用此数据集适当初始化。由于无法产生有意义的结果,LIOM的地图未显示。如图所示,与LOAM的地图相比,LIO-SAM的地图保留了环境更多细致的结构细节。这是因为LIO-SAM即使在机器人快速旋转时也能精确地在SO(3)中注册每个激光雷达帧。

### B. Walking数据集 

![Fig.4](../images/2023/04/LIO-SAM-Figure4.jpg)

图4:使用步行数据集的LOAM、LIOM和LIO-SAM的映射结果。

在此测试中,图4(b)中的LOAM地图在遇到激进的旋转时多次发散。LIOM优于LOAM。然而,其地图如图4(c)所示,由于不准确的点云配准,显示出许多模糊结构。LIO-SAM产生的地图与Google Earth图像一致,而无需使用GPS。

此测试旨在评估当系统在SE(3)中进行激进的平移和旋转时,我们方法的性能。此数据集中遇到的最大平移和旋转速度分别为1.8 m/s和213.9°/s。在数据收集期间,用户手持图2(a)所示的传感器套件,快速穿过MIT校园(图4(a))。在此测试中,图4(b)所示的LOAM地图在遇到激进旋转时在多个位置发散。在此测试中,LIOM优于LOAM。然而,其地图如图4(c)所示,在各个位置仍略有发散,且由许多模糊结构组成。因为LIOM旨在处理所有传感器测量,它仅以0.56×实时速度运行,而其他方法以实时速度运行。最后,LIO-SAM优于两种方法,产生的地图与可用的Google Earth图像一致。


### C. Campus Dataset

TABLE II: End-to-end translation error (meters)

|Dataset|LOAM|LIOM|LIO-odom|LIO-GPS|LIO-SAM|
|-------|----|----|--------|-------|-------|
|Campus|192.43|Fail|9.44|6.87|0.12|
|Park|121.74|34.60|36.36|2.93|0.04|
|Amsterdam|Fail|Fail|Fail|1.21|0.17|

此测试旨在显示引入GPS和环路闭合因子的好处。为此,我们故意禁用向图中插入GPS和环路闭合因子。当禁用GPS和环路闭合因子时,我们的方法称为LIO-odom,它仅利用IMU预积分和激光测距仪里程计因子。当使用GPS因子时,我们的方法称为LIO-GPS,它使用IMU预积分、激光测距仪里程计和GPS因子进行图构造。LIO-SAM在可用时使用所有因子。 

![Fig.5](../images/2023/04/LIO-SAM-Figure5.jpg)

Fig. 5: Results of various methods using the Campus dataset thatis gathered on the MIT campus. The red dot indicates the start andend location. The trajectory direction is clock-wise. LIOM is notshown because it fails to produce meaningful results.

为收集此数据集,用户使用手持设备在MIT校园内四处走动,然后返回相同的位置。由于映射区域内有许多建筑物和树木,GPS接收通常不可用,大部分时间不准确。过滤掉不一致的GPS测量后,GPS可用的区域如图5(a)中的绿色段所示。这些区域对应于不是被建筑物或树木包围的几个区域。

LOAM、LIO-odom、LIOGPS和LIO-SAM的估计轨迹如图5(a)所示。由于LIOM无法适当初始化和产生有意义的结果,因此未显示LIOM的结果。如图所示,与所有其他方法相比,LOAM的轨迹明显发散。在没有GPS数据校正的情况下,LIO-odom的轨迹在地图右下角开始明显发散。在GPS数据的帮助下,LIO-GPS可以在可用时修正偏差。但是,在数据集的后续部分中,GPS数据不可用。因此,由于漂移,当机器人返回起始位置时,LIO-GPS无法闭环。另一方面,LIO-SAM可以通过向图中添加环路闭合因子来消除漂移。LIO-SAM的地图与Google Earth图像对齐良好,如图5(b)所示。当机器人返回起点时,所有方法的相对平移误差如表II所示。

### D. Park Dataset

![Fig.6](../images/2023/04/LIO-SAM-Figure6.jpg)

Fig. 6: Results of various methods using the Park dataset that isgathered in Pleasant Valley Park, New Jersey. The red dot indicatesthe start and end location. The trajectory direction is clock-wise.

在此测试中,我们将传感器安装在UGV上,驱动车辆沿森林徒步小道行驶。机器人在行驶40分钟后返回其初始位置。UGV在三种道路表面上驾驶:沥青路面、草地覆盖的地面和覆盖着泥土的小道。由于缺乏悬架,当在非沥青道路上行驶时,机器人会遭受低幅度但高频率的振动。
为模拟具有挑战性的映射场景,我们仅在机器人位于开阔地区时使用GPS测量,如图6(a)中的绿色段所示。这样的映射场景代表机器人必须映射多个GPS否定区域的任务,并定期返回GPS可用区域以纠正漂移。

与前面的测试结果类似,LOAM、LIOM和LIO-odom由于没有绝对校正数据而遭受显着漂移。此外,LIOM仅以0.67×实时速度运行,而其他方法以实时速度运行。
虽然LIO-GPS和LIO-SAM的轨迹在水平面上重合,但它们的相对平移误差不同(表II)。因为没有可靠的绝对高度测量,LIO-GPS在高度上遭受漂移,并且无法在返回机器人的初始位置时闭合环路。LIO-SAM没有此类问题,因为它利用环路闭合因子消除漂移。

### E. Amsterdam Dataset

最后,我们在船上安装传感器套件,并在阿姆斯特丹的运河上巡航3个小时。虽然在此测试中传感器的运动相对平稳,但映射运河仍然具有挑战性,有几个原因。

许多桥梁跨越运河,形成退化情景,因为当船在它们下方时几乎没有有用的特征,类似于移动通过一条长长的、没有特征的走廊。由于没有地面,平面特征的数量也显著减少。当直接阳光在传感器视野内时,我们观察到激光雷达的许多错误检测,这在数据收集期间约占20%的时间。我们也因上方的桥梁和城市建筑物而只获得间歇性的GPS接收。

由于这些挑战,LOAM、LIOM和LIO-odom在此测试中都无法产生有意义的结果。与公园数据集中遇到的问题类似,LIO-GPS由于高度漂移而无法在返回机器人的起始位置时闭环,这进一步激发我们在LIO-SAM中使用环路闭合因子。 

### F. Benchmarking Results

TABLE III: RMSE translation error w.r.t GPS

|Dataset|LOAM|LIOM|LIO-odom|LIO-GPS|LIO-SAM|
|-------|----|----|--------|-------|-------|
|Park|47.31|28.96|23.96|1.09|0.96|

由于仅在公园数据集中获得全面GPS覆盖,我们显示相对于GPS测量历史的均方根误差(RMSE)结果,将其视为真实值。此RMSE误差不考虑z轴上的误差。如表III所示,LIO-GPS和LIO-SAM与GPS真值取得相似的RMSE误差。注意,如果我们向这两种方法提供完全访问所有GPS测量,则可以进一步将这两种方法的误差降低至少一个数量级。

然而,在许多映射设置中并非始终可获得完全的GPS访问权限。我们的意图是设计一个鲁棒的系统,可以在各种具有挑战性的环境中运行。

表IV显示了三种竞争方法在所有五个数据集中注册一个激光雷达帧的平均运行时间。在所有测试中,LOAM和LIO-SAM被迫实时运行。换句话说,如果运行时间超过100ms,而激光雷达的旋转速率为10Hz,则会丢弃一些激光雷达帧。LIOM获得无限时间来处理每个激光雷达帧。如表所示,LIO-SAM的运行时间明显少于其他两种方法,这使其更适合部署在低功耗嵌入式系统上。 



TABLE IV: Runtime of mapping for processing one scan (ms)

|Dataset|LOAM|LIOM|LIO-SAM|Stress test|
|-------|----|----|--------|-------|
|Rotation|83.6|Fail|41.9|13×|
|Walking|253.6|339.8|58.4|13×|
|Campus|244.9|Fail|97.8|10×|
|Park|266.4|245.2|100.5|9×|
|Amsterdam|Fail|Fail|79.31|1×|

们还通过以超过实时的速度向LIO-SAM提供数据来对其进行压力测试。当LIO-SAM与数据回放速度为1×实时时的结果相比,在没有故障的情况下达到相似的性能时,记录最大数据回放速度,并在表IV的最后一列中显示。如表所示,LIO-SAM能够以高达13×的速度处理数据超过实时。

我们注意到,LIO-SAM的运行时间更大程度上受特征图的密度影响,而不是因子图中的节点数和因子数的影响。例如,公园数据集是在特征丰富的环境中收集的,植被导致大量特征,而阿姆斯特丹数据集产生更稀疏的特征图。虽然公园测试的因子图由4,573个节点和9,365个因子组成,但阿姆斯特丹测试的图由23,304个节点和49,617个因子组成。 

尽管如此,LIO-SAM在阿姆斯特丹测试中使用的时间少于在公园测试中的运行时间。

![Fig.7](../images/2023/04/LIO-SAM-Figure7.jpg)

Fig. 7: Map of LIO-SAM aligned with Google Earth.


## V. CONCLUSIONS AND DISCUSSION

我们提出了LIO-SAM,一种通过平滑和映射进行紧密耦合的激光惯性里程计框架,用于在复杂环境中进行实时状态估计和映射。通过在因子图上形式化激光惯性里程计,LIO-SAM特别适合多传感器融合。附加的传感器测量可以轻易地作为新因子并入框架。提供绝对测量的传感器,如GPS、磁罗盘或高度表,可以用于消除长时间积累的或在特征贫乏环境中的激光惯性里程计的漂移。场景识别也可以轻易地并入系统。为改进系统的实时性能,我们提出了滑动窗口方法,该方法边缘化旧的激光雷达帧以进行扫描匹配。关键帧被选择添加到因子图中,并且仅当生成激光里程计和环路闭合因子时,才将新关键帧注册到固定大小的子关键帧集。这种在局部范围内而不是全局范围内进行的扫描匹配有助于LIO-SAM框架的实时性能。该提出的方法在各种环境下收集的数据集上进行了全面评估。结果表明,与LOAM和LIOM相比,LIO-SAM可以达到相似或更高的精度。未来的工作涉及在无人机上测试提出的系统。

## REFERENCES

[1] J. Zhang and S. Singh, “Low-drift and Real-time Lidar Odometry andMapping,” Autonomous Robots, vol. 41(2): 401-416, 2017.

[2] A. Geiger, P. Lenz, and R. Urtasun, “Are We Ready for AutonomousDriving? The KITTI Vision Benchmark Suite”, IEEE InternationalConference on Computer Vision and Pattern Recognition, pp. 33543361, 2012.

[3] P.J. Besl and N.D. McKay, “A Method for Registration of 3D Shapes,”IEEE Transactions on Pattern Analysis and Machine Intelligence, vol.
14(2): 239-256, 1992.

[4] A. Segal, D. Haehnel, and S. Thrun, “Generalized-ICP,” Proceedingsof Robotics: Science and Systems, 2009.

[5] W.S. Grant, R.C. Voorhies, and L. Itti, “Finding Planes in LiDARPoint Clouds for Real-time Registration,” IEEE/RSJ InternationalConference on Intelligent Robots and Systems, pp. 4347-4354, 2013.

[6] M. Velas, M. Spanel, and A. Herout, “Collar Line Segments for FastOdometry Estimation from Velodyne Point Clouds,” IEEE International Conference on Robotics and Automation, pp. 4486-4495, 2016.

[7] T. Shan and B. Englot, “LeGO-LOAM: Lightweight and Groundoptimized Lidar Odometry and Mapping on Variable Terrain,”IEEE/RSJ International Conference on Intelligent Robots and Systems,pp. 4758-4765, 2018.

[8] T. Shan, J. Wang, K. Doherty, and B. Englot, “Bayesian GeneralizedKernel Inference for Terrain Traversability Mapping,” In Conferenceon Robot Learning, pp. 829-838, 2018.

[9] S. Lynen, M.W. Achtelik, S. Weiss, M. Chli, and R. Siegwart, “ARobust and Modular Multi-sensor Fusion Approach Applied to MAVNavigation,” IEEE/RSJ International Conference on Intelligent Robotsand Systems, pp. 3923-3929, 2013.

[10] S. Yang, X. Zhu, X. Nian, L. Feng, X. Qu, and T. Mal, “A RobustPose Graph Approach for City Scale LiDAR Mapping,” IEEE/RSJInternational Conference on Intelligent Robots and Systems, pp. 11751182, 2018.

[11] M. Demir and K. Fujimura, “Robust Localization with Low-MountedMultiple LiDARs in Urban Environments,” IEEE Intelligent Transportation Systems Conference, pp. 3288-3293, 2019.

[12] Y. Gao, S. Liu, M. Atia, and A. Noureldin, “INS/GPS/LiDAR Integrated Navigation System for Urban and Indoor Environments usingHybrid Scan Matching Algorithm,” Sensors, vol. 15(9): 23286-23302,2015.

[13] S. Hening, C.A. Ippolito, K.S. Krishnakumar, V. Stepanyan, and M.
Teodorescu, “3D LiDAR SLAM integration with GPS/INS for UAVsin urban GPS-degraded environments,” AIAA Infotech@AerospaceConference, pp. 448-457, 2017.

[14] C. Chen, H. Zhu, M. Li, and S. You, “A Review of Visual-InertialSimultaneous Localization and Mapping from Filtering-Based andOptimization-Based Perspectives,” Robotics, vol. 7(3):45, 2018.

[15] C. Le Gentil,, T. Vidal-Calleja, and S. Huang, “IN2LAMA: InertialLidar Localisation and Mapping,” IEEE International Conference onRobotics and Automation, pp. 6388-6394, 2019.

[16] C. Qin, H. Ye, C.E. Pranata, J. Han, S. Zhang, and Ming Liu, “RLINS: A Robocentric Lidar-Inertial State Estimator for Robust andEfficient Navigation,” arXiv:1907.02233, 2019.

[17] H. Ye, Y. Chen, and M. Liu, “Tightly Coupled 3D Lidar InertialOdometry and Mapping,” IEEE International Conference on Roboticsand Automation, pp. 3144-3150, 2019.

[18] F. Dellaert and M. Kaess, “Factor Graphs for Robot Perception,”Foundations and Trends in Robotics, vol. 6(1-2): 1-139, 2017.

[19] M. Kaess, H. Johannsson, R. Roberts, V. Ila, J.J. Leonard, and F.
Dellaert, “iSAM2: Incremental Smoothing and Mapping Using theBayes Tree,” The International Journal of Robotics Research, vol.
31(2): 216-235, 2012.

[20] C. Forster, L. Carlone, F. Dellaert, and D. Scaramuzza, “On-ManifoldPreintegration for Real-Time Visual-Inertial Odometry,” IEEE Transactions on Robotics, vol. 33(1): 1-21, 2016.

[21] T. Moore and D. Stouch, “A Generalized Extended Kalman FilterImplementation for The Robot Operating System,” Intelligent Autonomous Systems, vol. 13: 335-348, 2016.

[22] G. Kim and A. Kim, “Scan Context: Egocentric Spatial Descriptor forPlace Recognition within 3D Point Cloud Map,” IEEE/RSJ International Conference on Intelligent Robots and Systems, pp. 4802-4809,2018.

[23] J. Guo, P. VK Borges, C. Park, and A. Gawel, “Local Descriptor forRobust Place Recognition using Lidar Intensity,” IEEE Robotics andAutomation Letters, vol. 4(2): 1470-1477, 2019.

[24] M. Quigley, K. Conley, B. Gerkey, J. Faust, T. Foote, J. Leibs,R. Wheeler, and A.Y. Ng, “ROS: An Open-source Robot OperatingSystem,” IEEE ICRA Workshop on Open Source Software, 2009.

[25] T. Qin, P. Li, and S. Shen, “Vins-mono: A Robust and VersatileMonocular Visual-Inertial State Estimator,” IEEE Transactions onRobotics, vol. 34(4): 1004-1020, 2018.

