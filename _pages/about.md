---
permalink: /
title: ""
excerpt: ""
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

<html>
<style>
div.noshow { display: none; }
div.bibtex {
	margin-right: 0%;
	margin-top: 1.2em;
	margin-bottom: 1em;
	border: 1px solid silver;
	padding: 0em 1em;
	background: #ffffee;
}
div.bibtex pre { font-size: 60%; overflow: auto;  width: 100%; padding: 0em 0em;}</style>
<script type="text/javascript">
    function toggleBibtex(articleid) {
        var bib = document.getElementById('bib_'+articleid);
        if (bib) {
            if(bib.className.indexOf('bibtex') != -1) {
                bib.className.indexOf('noshow') == -1?bib.className = 'bibtex noshow':bib.className = 'bibtex';
            }
        } else {
            return;
        }
    }
</script>
</html>

{% if site.google_scholar_stats_use_cdn %}
{% assign gsDataBaseUrl = "https://cdn.jsdelivr.net/gh/" | append: site.repository | append: "@" %}
{% else %}
{% assign gsDataBaseUrl = "https://raw.githubusercontent.com/" | append: site.repository | append: "/" %}
{% endif %}
{% assign url = gsDataBaseUrl | append: "google-scholar-stats/gs_data_shieldsio.json" %}

<span class='anchor' id='about-me'></span>

# 🧐 About Me
I am an incoming CS PhD student (25 Fall) at [Rutgers University](https://www.rutgers.edu/), supervised by [Prof. Ryan Tang](https://www.ruixiangtang.net/). I have completed my master’s degree at [Sensing IntelliGence and MAchine learning(SIGMA) Lab](http://sigma.whu.edu.cn/) in [Wuhan University](https://www.whu.edu.cn/), under the supervision of [Prof. Zengmao Wang](https://jszy.whu.edu.cn/wangzengmao/zh_CN/more/1231604/jsjjgd/index.htm) and [Prof. Bo Du](https://cs.whu.edu.cn/info/1019/2892.htm).

Previously, I was a research intern at [RZ-Lab](https://ruqizhang.github.io/) in [Purdue University](https://www.purdue.edu/), advised by [Prof. Ruqi Zhang](https://ruqizhang.github.io/). I was also fortunate to work with [Prof. Lu Cheng](https://lcheng.org/), [Prof. Bo Han](https://bhanml.github.io/) and [Jianing Zhu](https://zfancy.github.io/).<br>

🤔**Research Interests:** <br>
My current research focus is to develop methodologies for **trustworthy machine learning**, particularly in *<font color=red>reliability</font>* and its applications to boost the *<font color=red>safety</font>* of **large language models** and address critical challenges in **healthcare**. 
Besides, I am also experienced in other fields of machine learning like **active learning**, and its applications to **object detection** and **remote sensing**. <br>
<!-- If you are intereted in these areas or my previous works, feel free to reach out! I am always delighted for potential collaborations! -->
## **<font color=FireBrick>I'm finding research intern opportunities! You can find my</font> [<font color=DarkSlateBlue>CV</font>](images/CV-Boxuan.pdf) <font color=FireBrick>here. If you share the same research interests with me and are intereted in these areas or my previous works, welcome to add my</font> [<font color=DarkSlateBlue>Wechat</font>](images/IMG_2944.JPG)** <font color=FireBrick>. I am always delighted for potential collaborations!</font>


# 🔥 News
<!-- - **2024.09:** &nbsp;🎉🎉 Our paper titled "What If the Input is Expanded in OOD Detection?" has been accepted by [NeurIPS 2024](https://neurips.cc/) 
- **2024.06:** &nbsp;🎉🎉 Start my remote research internship in [CS@Purdue University](https://www.cs.purdue.edu/), collaborating with [Dr. Ruqi Zhang](https://ruqizhang.github.io/). 
- **2024.05:** &nbsp;🎉🎉 Successfully defended my Master thesis!
- **2024.04:** &nbsp;🎉🎉 I will join [CS@Purdue University](https://www.cs.purdue.edu/) as a research intern in June 2024.
- **2024.01:** &nbsp;🎉🎉 One paper has been accepted by [GRSL 2024](https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=8859").
- **2023.11:** &nbsp;🎉🎉 I will join [TMLR Group@ HKBU](https://github.com/tmlr-group) as a research intern. -->
<div style="max-height: 200px; overflow-y: auto;">
<ul>
  <li><em>2025.02:</em> &nbsp;🎉🎉 Check our two preprint works regarding LLMs! One investigates <a href="">Uncertainty Quantification for LLMs</a>, and the other explores <a href="">Connections between Creativity and Hallucination in LLMs</a>.</li>
  <li><em>2025.02:</em> &nbsp;🎉🎉 I will join <a href="https://www.cs.rutgers.edu/">CS@Rutgers University</a> as a PhD student in 2025 Fall, supervised by <a href="https://www.ruixiangtang.net/">Prof. Ryan Tang</a>!</li>
  <li><em>2024.09:</em> &nbsp;🎉🎉 Our paper titled "What If the Input is Expanded in OOD Detection?" has been accepted by <a href="https://neurips.cc/">NeurIPS 2024</a>.</li>
  <li><em>2024.06:</em> &nbsp;🎉🎉 Start my remote research internship in <a href="https://www.cs.purdue.edu/">CS@Purdue University</a>, collaborating with <a href="https://ruqizhang.github.io/">Dr. Ruqi Zhang</a>.</li>
  <li><em>2024.05:</em> &nbsp;🎉🎉 Successfully defended my Master thesis!</li>
  <li><em>2024.04:</em> &nbsp;🎉🎉 I will join <a href="https://www.cs.purdue.edu/">CS@Purdue University</a> as a research intern in June 2024.</li>
  <li><em>2024.01:</em> &nbsp;🎉🎉 One paper has been accepted by <a href="https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=8859">GRSL 2024</a>.</li>
  <li><em>2023.11:</em> &nbsp;🎉🎉 I will join <a href="https://github.com/tmlr-group">TMLR Group@ HKBU</a> as a research intern.</li>
  <li><em>2023.10:</em> &nbsp;🎉🎉 Honored to receive <a href="http://www.csrme.com/Home/Content/show/id/4432.do">3rd Prize</a> @ TBM Machine Learning Competition.</li>
  <li><em>2023.10:</em> &nbsp;🎉🎉 Attend 2nd TBM Machine Learning Competition(held by <a href="http://www.csrme.com/">CSRME</a>) and present research work @ Shanghai.</li>
  <li><em>2023.09:</em> &nbsp;🎉🎉 Start my second-year research & learning journey in WHU.</li>
</ul>
</div>

# 💻 Recent Projects
(For more details can click the images)
<div>
<ul>
    <!-- <br> -->
        <a href="https://confidence-average.github.io/"><img src="./images/logo_cover.jpg" width="320" style="box-shadow: 4px 4px 8px #888" alt="CoVer"></a>
        &nbsp;&nbsp;
        <a href="https://github.com/ZBox1005/CoT-UQ"><img src="./images/logo-cot-uq.jpg" width="320" style="box-shadow: 4px 4px 8px #888" alt="CoT-UQ"></a>
</ul>
</div>

# 📝 Publications

(\* indicates **equal contribution**)

<div class='paper-box'><div class='paper-box-image'><div><div class="badge">Preprint</div><img src='images/cot-uq.png' alt="sym" width="100%"></div></div>
<div class='paper-box-text' markdown="1">

**<font color=DarkSlateBlue style="font-size: 18px;">CoT-UQ: Improving Response-wise Uncertainty Quantification in LLMs with Chain-of-Thought</font>**

**\[<font color="#993333">Preprint, arXiv 2025</font>\]**

**Boxuan Zhang** and Ruqi Zhang

**<font color=SandyBrown>TL;DR:</font>** Propose to quantify response-wise uncertainty by integrating LLMs’ inherent reasoning capabilities through Chain-of-Thought (CoT) into the UQ process.

<!-- **<font color=DarkSlateBlue>Neural Information Processing Systems (NeurIPS), 2024</font>** -->

[**\[PDF\]**]() &nbsp; 
[**\[Code\]**](https://github.com/ZBox1005/CoT-UQ) 
</div>
</div>

<div class='paper-box'><div class='paper-box-image'><div><div class="badge">Preprint</div><img src='images/hcb.png' alt="sym" width="100%"></div></div>
<div class='paper-box-text' markdown="1">

**<font color=DarkSlateBlue style="font-size: 18px;">Shakespearean Sparks: The Dance of Hallucination and Creativity in LLMs’ Decoding Layers</font>**

**\[<font color="#993333">Preprint, arXiv 2025</font>\]**

Zicong He\*, **Boxuan Zhang\***, and Lu Cheng

**<font color=SandyBrown>TL;DR:</font>** Given the philosophical nature of creativity, we propose a narrow definition tailored to LLMs and introduce an evaluation framework, HCL, which quantifies Hallucination and Creativity across different Layers of LLMs during decoding.

<!-- **<font color=DarkSlateBlue>Neural Information Processing Systems (NeurIPS), 2024</font>** -->

[**\[PDF\]**]() &nbsp; 
[**\[Code\]**](https://github.com/ZicongHe2002/HCL-Spark) 
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
[**\[Project Page\]**](https://confidence-average.github.io/) &nbsp; 
[**\[Code\]**](https://github.com/tmlr-group/CoVer) &nbsp;
<a href="javascript:toggleBibtex('what24')"><strong>\[BibTeX\]</strong></a>
<div id="bib_what24" class="bibtex noshow">
    <pre>
@inproceedings{zhang2024what,
    title={What If the Input is Expanded in OOD Detection?},
    author={Zhang, Boxuan and Zhu, Jianing and Wang, Zengmao and Liu, Tongliang and Du, Bo and Han, Bo},
    booktitle={The Thirty-Eighth Annual Conference on Neural Information Processing Systems},
    year={2024},
} </pre>
  </div>
</div>
</div>



<div class='paper-box'><div class='paper-box-image'><div><div class="badge">GRSL 2024</div><img src='images/ssod-at.png' alt="sym" width="100%"></div></div>
<div class='paper-box-text' markdown="1">

**<font color=DarkSlateBlue style="font-size: 18px;">Boosting Semisupervised Object Detection in Remote-Sensing Images With Active Teaching</font>**

**\[<font color="#993333">IEEE Geoscience and Remote Sensing Letters (GRSL), 2024</font>\]**

**Boxuan Zhang**, Zengmao Wang and Bo Du

**<font color=SandyBrown>TL;DR:</font>** Propose to boost semi-supervised object detection with active teaching (SSOD-AT) in remote sensing images, which helps to alleviate the dependency on limited labeled images in remote sensing scenarios.

<!-- **<font color=DarkSlateBlue>IEEE Geoscience and Remote Sensing Letters (GRSL), 2024</font>** -->

[**\[PDF\]**](https://ieeexplore.ieee.org/document/10411936) &nbsp; 
[**\[Code\]**](https://github.com/ZBox1005/SSOD-AT) 
</div>
</div>

# 📖 Educations
- *2022.09 - 2024.06*, Master, School of Computer Science, Wuhan University, China. 
- *2018.09 - 2022.06*, Undergraduate, School of Computer Science, Wuhan University, China. 

<!-- # 💬 Invited Talks
- *2021.06*, Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ornare aliquet ipsum, ac tempus justo dapibus sit amet. 
- *2021.03*, Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ornare aliquet ipsum, ac tempus justo dapibus sit amet.  \| [\[video\]](https://github.com/) -->

# 👨🏻‍💻 Research Experience
<!-- - *2019.05 - 2020.02*, [Lorem](https://github.com/), China. -->
- *2024.06 - present*, **Research Assistant** <br>
  Department of [Computer Science](https://cs.uic.edu/), University of Illinois Chicago([UIC](https://www.uic.edu/)) <br>
  Supervisor: [Prof. Lu Cheng](https://lcheng.org/) <br>
- *2024.06 - 2025.02*, **Research Intern** <br>
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
- *2024.04* Outstanding Communist Party and Youth League member, Wuhan University. 
- *2023.10* Third Prize Winner of TBM Machine Learning Competition.