---
permalink: /
title: ""
excerpt: ""
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

{% if site.google_scholar_stats_use_cdn %}
{% assign gsDataBaseUrl = "https://cdn.jsdelivr.net/gh/" | append: site.repository | append: "@" %}
{% else %}
{% assign gsDataBaseUrl = "https://raw.githubusercontent.com/" | append: site.repository | append: "/" %}
{% endif %}
{% assign url = gsDataBaseUrl | append: "google-scholar-stats/gs_data_shieldsio.json" %}

<span class='anchor' id='about-me'></span>

I’m a M.S. student at [Sensing IntelliGence and MAchine learning(SIGMA) Lab](http://sigma.whu.edu.cn/) in [Wuhan University](https://www.whu.edu.cn/), under the supervision of [Prof. Zengmao Wang](https://jszy.whu.edu.cn/wangzengmao/zh_CN/more/1231604/jsjjgd/index.htm) and [Prof. Bo Du](https://cs.whu.edu.cn/info/1019/2892.htm). Currently, I am a Research Intern in the Department of [Computer Science](https://www.cs.purdue.edu/) at [Purdue University](https://www.purdue.edu/), under the supervision of [Prof. Ruqi Zhang](https://ruqizhang.github.io/). Before that, I was a Research Intern at [TMLR Group](https://github.com/tmlr-group), [Hong Kong Baptist University](https://www.hkbu.edu.hk/en/index.html), fortunately working with [Prof. Bo Han](https://bhanml.github.io/) and [Jianing Zhu](https://zfancy.github.io/).

**Research Interests:** <br>
My primary research objective is to build a reliable and efficient AI model. <br>
My research interests include **trustworthy machine learning**, particularly in *reliability* and its applications to boost the **safety** of foundation models. 
Besides, I am also experienced in other fields of machine learning, including **incremental learning** and **active learning**, and their application to **computer vision**. <br>
If you are intereted in these areas or my previous works, feel free to reach out! I am always delighted for potential collaborations!


# 🔥 News
- **2024.09:** &nbsp;🎉🎉 Our paper titled "What If the Input is Expanded in OOD Detection?" has been accepted by [NeurIPS 2024](https://neurips.cc/) 
- **2024.06:** &nbsp;🎉🎉 Start my remote research internship in [CS@Purdue University](https://www.cs.purdue.edu/), collaborating with [Dr. Ruqi Zhang](https://ruqizhang.github.io/). 
- **2024.05:** &nbsp;🎉🎉 Successfully defended my Master thesis!
- **2024.04:** &nbsp;🎉🎉 I will join [CS@Purdue University](https://www.cs.purdue.edu/) as a research intern in June 2024.
- **2024.01:** &nbsp;🎉🎉 One paper has been accepted by [GRSL 2024](https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=8859").
- **2023.11:** &nbsp;🎉🎉 I will join [TMLR Group@ HKBU](https://github.com/tmlr-group) as a research intern.

# 📝 Publications

(\* indicates **equal contribution**)

<div class='paper-box'><div class='paper-box-image'><div><div class="badge">Preprint</div><img src='images/cot-uq.png' alt="sym" width="100%"></div></div>
<div class='paper-box-text' markdown="1">

**<font color=DarkSlateBlue style="font-size: 18px;"></font>**

**<font color=DarkSlateBlue style="font-size: 18px;">CoT-UQ: Improving Response-wise Uncertainty Quantification in LLMs with Chain-of-Thought</font>**

**\[<font color="#993333">Preprint, arXiv 2025</font>\]**

**Boxuan Zhang** and Ruqi Zhang

**<font color=SandyBrown>TL;DR:</font>** Propose to quantify response-wise uncertainty by integrating LLMs’ inherent reasoning capabilities through Chain-of-Thought (CoT) into the UQ process.

<!-- **<font color=DarkSlateBlue>Neural Information Processing Systems (NeurIPS), 2024</font>** -->

[**\[PDF\]**]() &nbsp; 
[**\[Code\]**](https://github.com/ZBox1005/CoT-UQ) 
</div>
</div>



<div class='paper-box'><div class='paper-box-image'><div><div class="badge">NeurIPS 2024</div><img src='images/cover.png' alt="sym" width="100%"></div></div>
<div class='paper-box-text' markdown="1">

**<font color=DarkSlateBlue style="font-size: 18px;"></font>**

**<font color=DarkSlateBlue style="font-size: 18px;">What If the Input is Expanded in OOD Detection?</font>**

**\[<font color="#993333">Neural Information Processing Systems (NeurIPS), 2024</font>\]**

**Boxuan Zhang\***, Jianing Zhu\*, Zengmao Wang, Tongliang Liu, Bo Du and Bo Han

**<font color=SandyBrown>TL;DR:</font>** Propose a novel perspective to employ different common corruptions on the input space to expand the representation dimension for OOD detection.

<!-- **<font color=DarkSlateBlue>Neural Information Processing Systems (NeurIPS), 2024</font>** -->

[**\[PDF\]**](https://proceedings.neurips.cc/paper_files/paper/2024/file/25cc3adf8c85f7c70989cb8a97a691a7-Paper-Conference.pdf) &nbsp; 
[**\[Project\]**](https://confidence-average.github.io/) &nbsp; 
[**\[Code\]**](https://github.com/tmlr-group/CoVer) 
</div>
</div>



<div class='paper-box'><div class='paper-box-image'><div><div class="badge">GRSL 2024</div><img src='images/ssod-at.png' alt="sym" width="100%"></div></div>
<div class='paper-box-text' markdown="1">

**<font color=DarkSlateBlue style="font-size: 18px;">Boosting Semisupervised Object Detection in Remote-Sensing Images With Active Teaching</font>**

**\[<font color="#993333">IEEE Geoscience and Remote Sensing Letters (GRSL), 2024</font>\]**

**Boxuan Zhang**, Zengmao Wang and Bo Du

**<font color=SandyBrown>TL;DR:</font>** Propose to boost semi-supervised object detection with active teaching (SSOD-AT) in remote sensing images, which helps to alleviate the dependency on limited labeled images in remote sensing scenarios.

<!-- **<font color=DarkSlateBlue>IEEE Geoscience and Remote Sensing Letters (GRSL), 2024</font>** -->

[**\[PDF\]**](https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=8859) &nbsp; 
[**\[Code\]**](https://github.com/ZBox1005/SSOD-AT) 
</div>
</div>

# 📖 Educations
- *2022.09 - 2024.06*, Master, School of Computer Science, Wuhan University, China. 
- *2018.09 - 2022.06*, Undergraduate, School of Computer Science, Wuhan University, China. 

<!-- # 💬 Invited Talks
- *2021.06*, Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ornare aliquet ipsum, ac tempus justo dapibus sit amet. 
- *2021.03*, Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ornare aliquet ipsum, ac tempus justo dapibus sit amet.  \| [\[video\]](https://github.com/) -->

# 💻 Research Experience
<!-- - *2019.05 - 2020.02*, [Lorem](https://github.com/), China. -->
- *2024.06 - present*, **Research Intern** <br>
  Department of [Computer Science](https://www.cs.purdue.edu/), [Purdue University](https://www.purdue.edu/) <br>
  Supervisor: [Prof. Ruqi Zhang](https://ruqizhang.github.io/) <br>
- *2023.11 - 2024.06*, **Research Intern** <br>
  [TMLR Group](https://github.com/tmlr-group), HongKong Baptist University ([HKBU](https://www.hkbu.edu.hk/en/index.html)) <br>
  Supervisor: [Prof. Bo Han](https://bhanml.github.io/) <br>
  Collaborate with: [Jianing Zhu](https://zfancy.github.io/) <br>
- *2023.08 - 2023.10*, **Research Intern** <br>
  School of [Civil Engineering](https://civ.whu.edu.cn/), Wuhan University ([WHU](https://www.whu.edu.cn/)) <br>
  Supervisor: [Prof. Xiaoping Zhang](https://civ.whu.edu.cn/info/1052/1155.htm) <br>
- 2022.09 - 2024.06, **Research Assistant** <br>
  [SIGMA Lab](http://sigma.whu.edu.cn/), Wuhan University ([WHU](https://www.whu.edu.cn/)) <br>
  Supervisor: [Prof. Zengmao Wang](https://jszy.whu.edu.cn/wangzengmao/zh_CN/more/1231604/jsjjgd/index.htm) and [Prof. Bo Du](https://cs.whu.edu.cn/info/1019/2892.htm) <br>

# 🎖 Honors and Awards
- *2023.10* Third Prize Winner of TBM Machine Learning Competition.
- *2024.04* Outstanding Communist Party and Youth League member, Wuhan University. 