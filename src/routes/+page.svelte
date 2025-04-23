
<style>

    .body {
        background-color: #ffffff;
    }

    a {
        text-decoration: none;
    }

    .overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.4);
        z-index: 1;
    }

    .title {
        color: #fdbd2d;
        font-weight: bold;

        /*font-size: 120px;*/
        font-size: clamp(50px, 10vw, 120px);

        position: absolute;
        top: 10%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .description {
        width: 100%;
        text-align: center;
        color: #ffffff;
        font-weight: bold;
        font-size: clamp(30px, 8vw, 80px);
        position: absolute;
        top: 30%;
        left: 50%;
        transform: translate(-50%, -50%);
    }


    .main-content {
        display: flex;
        justify-content: space-between;
        background: url('wallpaper4.jpg') no-repeat fixed;
        background-size: cover;
        align-items: center;
        height: 100vh;
    }

    .title-section {
        width: 100%;
        height: 100%;
        z-index: 2;
    }

    .wave-container {
        position: absolute;
        bottom: 0;
        margin: 0;
        padding: 0;
        left: 0;
        width: 100%;
        height: 200px;
        z-index: 2;
    }

    img {
        width: clamp(80px, 30%, 500px);
        margin: 0 auto;
        display: block;
    }

    .section-title {
        text-align: center;
        font-size: 2.5em;
        margin: 20px 0;
        color: #1d442f;
    }

    /*button 2 */

    .button {
        height: 50px;
        width: 200px;
        position: relative;
        background-color: transparent;
        cursor: pointer;
        border: 2px solid #ffffff;
        overflow: hidden;
        border-radius: 30px;
        color: #ffffff;
        transition: all 0.5s ease-in-out;
    }

    .btn-txt {
        z-index: 1;
        font-weight: 800;
        letter-spacing: 4px;
    }

    .type1::after {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        transition: all 0.5s ease-in-out;
        background-color: #ffffff;
        border-radius: 30px;
        visibility: hidden;
        height: 10px;
        width: 10px;
        z-index: -1;
    }

    .button:hover {
        box-shadow: 1px 1px 200px #ffffff;
        color: #000000;
        border: none;
    }

    .type1:hover::after {
        visibility: visible;
        transform: scale(100) translateX(2px);
    }

    .center-pos {
        position: absolute;
        top: 60%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .space-beetween {
        display: flex;
        justify-content: space-between;
        width: 100%;
        max-width: 500px;
    }
</style>

<div class="body">
    <!-- Main Content -->
    <section class="main-content">
        <div class="overlay"></div>
        <div class="title-section">
            <p class="title yellow">Pr0j3ct</p>
            <p class="description">
                Faconne TES projets<br>
            </p>

            <div class="center-pos">
                <div class="space-beetween">
                    <a href="/login"><button class="button type1 center-pos">
                        <span class="btn-txt">Commencer</span>
                    </button></a>
                </div>
            </div>


        </div>

        <div class="wave-container">
            <svg viewBox="0 0 1000 200" preserveAspectRatio="none" style="width: 100%; height: 100%;">
                <path
                        d="M0,200 L0.0,100.0 C 6.3,101.2 18.8,103.7 25.0,104.9 C 31.3,106.1 43.8,108.4 50.0,109.6 C 56.3,110.8 68.8,113.1 75.0,114.3 C 81.3,115.4 93.8,117.6 100.0,118.7 C 106.3,119.7 118.8,121.8 125.0,122.8 C 131.3,123.8 143.8,125.6 150.0,126.6 C 156.3,127.4 168.8,129.1 175.0,129.9 C 181.3,130.6 193.8,132.1 200.0,132.8 C 206.3,133.4 218.8,134.6 225.0,135.2 C 231.3,135.6 243.8,136.6 250.0,137.0 C 256.3,137.3 268.8,138.0 275.0,138.3 C 281.3,138.5 293.8,138.8 300.0,138.9 C 306.3,138.9 318.8,138.9 325.0,138.9 C 331.3,138.8 343.8,138.5 350.0,138.4 C 356.3,138.1 368.8,137.5 375.0,137.2 C 381.3,136.8 393.8,135.9 400.0,135.5 C 406.3,134.9 418.8,133.8 425.0,133.2 C 431.3,132.5 443.8,131.0 450.0,130.3 C 456.3,129.5 468.8,127.9 475.0,127.1 C 481.3,126.1 493.8,124.3 500.0,123.3 C 506.3,122.3 518.8,120.3 525.0,119.3 C 531.3,118.2 543.8,116.0 550.0,114.9 C 556.3,113.8 568.8,111.5 575.0,110.3 C 581.3,109.1 593.8,106.7 600.0,105.5 C 606.3,104.3 618.8,101.8 625.0,100.6 C 631.3,99.4 643.8,97.0 650.0,95.8 C 656.3,94.6 668.8,92.2 675.0,91.0 C 681.3,89.8 693.8,87.5 700.0,86.3 C 706.3,85.2 718.8,83.0 725.0,81.9 C 731.3,80.9 743.8,78.8 750.0,77.7 C 756.3,76.8 768.8,74.9 775.0,73.9 C 781.3,73.1 793.8,71.3 800.0,70.5 C 806.3,69.8 818.8,68.3 825.0,67.5 C 831.3,66.9 843.8,65.7 850.0,65.1 C 856.3,64.6 868.8,63.7 875.0,63.2 C 881.3,62.9 893.8,62.2 900.0,61.9 C 906.3,61.7 918.8,61.3 925.0,61.1 C 931.3,61.1 943.8,61.0 950.0,61.0 C 956.3,61.1 968.8,61.4 975.0,61.5 C 981.3,61.8 993.8,62.3 1000.0,62.6 C 1006.3,63.0 1018.8,63.9 1025.0,64.3 L1000.0,200.0 L0,200.0Z"
                        fill="#ffffff"
                />
            </svg>
        </div>
    </section>

    <!--    // presentation-->
    <section>
        <h1 class="section-title">Des projects sans limite !</h1>
        <img src="peoples.jpg" alt="People working together" class="people-image">
    </section>

    <section>
        <h1 class="section-title">Des outils pour vous aider</h1>
        <img src="tools.jpg" alt="Tools" class="tools-image">
    </section>

    <section>
        <h1 class="section-title">Une personalisation total</h1>
        <img src="community.jpg" alt="Community" class="community-image">
    </section>

    <footer>
        <div class="space-beetween">
            <p>© 2025 Pr0j3ct. All rights reserved.</p>
        </div>
    </footer>
</div>
