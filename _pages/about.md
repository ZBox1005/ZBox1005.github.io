---
permalink: /
title: "About"
author_profile: true
redirect_from: 
  - /home/
  - /home.html
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

I’m a M.S. student at [Sensing IntelliGence and MAchine learning(SIGMA) Lab](http://sigma.whu.edu.cn/) in [Wuhan University](https://www.whu.edu.cn/), under the supervision of [Prof. Zengmao Wang](http://multimedia.whu.edu.cn/index.php?a=show&catid=69&id=141) and [Prof. Bo Du](https://cs.whu.edu.cn/info/1019/2892.htm). Currently, I am an intern student at [Trustworthy Machine Learning and Reasoning(TMLR) Group](https://github.com/tmlr-group) in [HongKong Baptist University](https://www.hkbu.edu.hk/en/index.html), under the supervision of [Prof. Bo Han](https://bhanml.github.io/). <br>
You can find my CV here: [Boxuan Zhang's Curriculum Vitae](assets/CV-4.10.pdf).

🤔 Research Interests
------
Currently, my primary research objective is to build a reliable and efficient AI model. <br>
My research interests include Trustworthy and Efficient Machine Learning, Active Learning and Computer Vision.

🔥 Recent News
------
- \[June 2024\] Start my remote research internship in [CS@Purdue University](https://www.cs.purdue.edu/), collaborating with [Dr. Ruqi Zhang](https://ruqizhang.github.io/). <br>
- \[May 2024\] Successfully defended my Master thesis!
- \[April 2024\] I will join [CS@Purdue University](https://www.cs.purdue.edu/) as a research intern in June 2024. <br>
- \[Jan. 2024\] One paper is accepted by [GRSL 2024](https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=8859"). <br>
- \[Nov. 2023\] I will join [TMLR Group@ HKBU](https://github.com/tmlr-group) as a research intern. <br>
- \[Oct. 2023\] Honored to receive [3rd Award](http://www.csrme.com/Home/Content/show/id/4432.do) @ TBM Machine Learning Competition.  <br>
<!-- \[Oct. 2023\]  Attend 2nd TBM Machine Learning Competition(held by [CSRME](http://www.csrme.com/)) and present research work @ Shanghai. <br> -->
<!-- - \[Sept. 2023\] Start my second-year research & learning journey in WHU. <br> -->
<!-- - \[Aug. 2023\]  Welcome to check the [project page](https://github.com/ZBox1005/SSOD-AT) of my first work **SSOD-AT**, which has been submitted to [GRSL 2024](https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=8859"). <br> -->


🎓 Education
------
- **M.S.** in Artificial Intelligence, 2022.09 - 2024.06 <br>
  School of Computer Science <br>
  Wuhan University ([WHU](https://www.whu.edu.cn/)), Hubei, China
- **B.Eng.** in Computer Science and Technology, 2018.09 - 2022.06 <br>
  School of Computer Science <br>
  Wuhan University ([WHU](https://www.whu.edu.cn/)), Hubei, China


💼 Work Experience
------
- **Research Intern**, 2023.11 - 2024.06 <br>
  [TMLR Group](https://github.com/tmlr-group), HongKong Baptist University ([HKBU](https://www.hkbu.edu.hk/en/index.html)) <br>
  Supervisor: [Prof. Bo Han](https://bhanml.github.io/)
- **Research Intern**, 2023.08 - 2023.10 <br>
  School of [Civil Engineering](https://civ.whu.edu.cn/), Wuhan University ([WHU](https://www.whu.edu.cn/)) <br>
  Supervisor: [Prof. Xiaoping Zhang](https://civ.whu.edu.cn/info/1052/1155.htm)
- **Research Assistant**, 2022.09 - 2024.09 (Expected) <br>
  [SIGMA Lab](http://sigma.whu.edu.cn/), Wuhan University ([WHU](https://www.whu.edu.cn/)) <br>
  Supervisor: [Prof. Zengmao Wang](http://multimedia.whu.edu.cn/index.php?a=show&catid=69&id=141) and [Prof. Bo Du](https://cs.whu.edu.cn/info/1019/2892.htm) 
- **Undergraduate Research Assistant**, 2021.12 - 2022.05 <br>
  [NERCMS](http://multimedia.whu.edu.cn/), Wuhan University ([WHU](https://www.whu.edu.cn/)) <br>
  Supervisor: [Prof. Jing Xiao](http://jszy.whu.edu.cn/xiaojing2/zh_CN/index.htm)
  

📖 Publications
------
- **Boxuan Zhang**, Zengmao Wang and Bo Du. <br>
  **Boosting Semisupervised Object Detection in Remote-Sensing Images With Active Teaching** <br>
  *IEEE Geoscience and Remote Sensing Letters* (**GRSL**), 2024 <br>
  \[<a href="javascript:toggleBibtex('menpo14')">BibTeX</a>\] \[[PDF](https://ieeexplore.ieee.org/document/10411936)\] \[[Code](https://github.com/ZBox1005/SSOD-AT)\] <br>

  <div id="bib_menpo14" class="bibtex noshow">
    <pre>
@article{zhang2024boosting,
    title={Boosting Semi-Supervised Object Detection in Remote Sensing Images with Active Teaching},
    author={Zhang, Boxuan and Wang, Zengmao and Du, Bo},
    journal={IEEE Geoscience and Remote Sensing Letters},
    year={2024},
    publisher={IEEE}
} </pre>
  </div>
 

👨🏻‍💻 Projects
------
- **Machine Learning for Tunnel Boring Machine Excavation** <br>
  [CSRME](http://www.csrme.com/), National Competition @ Shanghai, Oct. 2023 <br>
  \[[Slides](files/TBM.pptx)\] \[[Paper](files/TBM-paper.pdf)\] \[[Code](https://github.com/ZBox1005/TBM-Competition)\]
- **Self-Supervised Techniques for Intelligent Image Annotation** <br>
  [Department of Science and Technology of Hubei Province](https://kjt.hubei.gov.cn/), Technology Innovation Program, April 2023 <br> 


🏆 Awards
------
- Outstanding Communist Party member and Communist Youth League member, School of Computer Science, WHU, April 2024
- (3st place) The Second TBM Excavation Parameter Data Sharing and Machine Learning Competition, Oct. 2023




