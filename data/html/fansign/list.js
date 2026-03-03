const templates = [{
  html: text => `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meme Generator</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap');

        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f4f4f4;
        }

        .meme-container {
            position: relative;
            display: inline-block;
            text-align: center;
        }

        .meme-container img {
            object-fit: cover;
        }

        .meme-text {
            position: absolute;
            left: 218px;
            top: 25px;
            width: 324px;
            height: 235px;
            color: black;
            font-family: 'Patrick Hand', cursive;
            font-size: 45px;
            font-weight: bold;
            text-align: center;
            word-wrap: break-word;
            line-height: 1.2;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }
    </style>
</head>
<body>

    <div class="meme-container">
        <img src="https://i.pinimg.com/originals/16/37/17/163717b994654c0bc17f7ae70a14615f.jpg" alt="Meme Image">
        <div class="meme-text">${text}</div>
    </div>

</body>
</html>`
}, {
  html: text => `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meme Generator</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap');

        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f4f4f4;
        }

        .meme-container {
            position: relative;
            display: inline-block;
            text-align: center;
        }

        .meme-container img {
            object-fit: cover;
        }

        .meme-text {
            position: absolute;
            left: 66px;
            top: 323px;
            width: 640px;
            height: 879px;
            color: black;
            font-family: 'Patrick Hand', cursive;
            font-size: 65px;
            font-weight: bold;
            text-align: center;
            word-wrap: break-word;
            line-height: 1.1;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            padding: 10px;
            box-sizing: border-box;
        }
    </style>
</head>
<body>

    <div class="meme-container">
        <img src="https://i.pinimg.com/originals/52/99/de/5299de50d2a4b9ece6a631ceb6cfd5b3.jpg" alt="Meme Image">
        <div class="meme-text">${text}</div>
    </div>

</body>
</html>`
}, {
  html: text => `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meme Generator</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap');

        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f4f4f4;
        }

        .meme-container {
            position: relative;
            display: inline-block;
            text-align: center;
        }

        .meme-container img {
            object-fit: cover;
        }

        .meme-text {
            position: absolute;
            left: 81px;
            top: 25px;
            width: 336px;
            height: 230px;
            color: black;
            font-family: 'Patrick Hand', cursive;
            font-size: 32px;
            font-weight: bold;
            text-align: center;
            word-wrap: break-word;
            line-height: 1.2;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            padding: 5px;
            box-sizing: border-box;
        }
    </style>
</head>
<body>

    <div class="meme-container">
        <img src="https://i.pinimg.com/originals/4b/fd/05/4bfd05293cd9fa7a9d22f71bb968ca44.jpg" alt="Meme Image">
        <div class="meme-text">${text}</div>
    </div>

</body>
</html>`
}, {
  html: text => `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meme Generator</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap');

        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f4f4f4;
        }

        .meme-container {
            position: relative;
            display: inline-block;
            text-align: center;
        }

        .meme-container img {
            object-fit: cover;
        }

        .meme-text {
            position: absolute;
            left: 258px;
            top: 750px;
            width: 505px;
            height: 317px;
            color: black;
            font-family: 'Patrick Hand', cursive;
            font-size: 55px;
            font-weight: bold;
            text-align: center;
            word-wrap: break-word;
            line-height: 1.1;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            padding: 8px;
            box-sizing: border-box;
        }
    </style>
</head>
<body>

    <div class="meme-container">
        <img src="https://i.pinimg.com/originals/d8/56/01/d85601f6d14a4ed5f8542361da6f5594.png" alt="Meme Image">
        <div class="meme-text">${text}</div>
    </div>

</body>
</html>`
}, {
  html: text => `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meme Generator</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap');

        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f4f4f4;
        }

        .meme-container {
            position: relative;
            display: inline-block;
            text-align: center;
        }

        .meme-container img {
            object-fit: cover;
        }

        .meme-text {
            position: absolute;
            left: 262px;
            top: 175px;
            width: 167px;
            height: 223px;
            color: black;
            font-family: 'Patrick Hand', cursive;
            font-size: 25px;
            font-weight: bold;
            text-align: center;
            word-wrap: break-word;
            line-height: 1.15;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            padding: 6px;
            box-sizing: border-box;
        }
    </style>
</head>
<body>

    <div class="meme-container">
        <img src="https://i.pinimg.com/originals/97/8a/ad/978aad731ecea982769174d6114778ca.jpg" alt="Meme Image">
        <div class="meme-text">${text}</div>
    </div>

</body>
</html>`
}, {
  html: text => `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meme Generator</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap');

        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f4f4f4;
        }

        .meme-container {
            position: relative;
            display: inline-block;
            text-align: center;
        }

        .meme-container img {
            object-fit: cover;
        }

        .meme-text {
            position: absolute;
            left: 284px;
            transform: rotate(3deg);
            top: 396px;
            width: 363px;
            height: 358px;
            color: black;
            font-family: 'Patrick Hand', cursive;
            font-size: 50px;
            font-weight: bold;
            text-align: center;
            word-wrap: break-word;
            line-height: 1.2;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            padding: 10px;
            box-sizing: border-box;
        }
    </style>
</head>
<body>

    <div class="meme-container">
        <img src="https://i.pinimg.com/originals/b4/51/b2/b451b228a66d109a072017a0a92f4f6b.jpg" alt="Meme Image">
        <div class="meme-text">${text}</div>
    </div>

</body>
</html>`
}, {
  html: text => `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meme Generator</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap');

        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f4f4f4;
        }

        .meme-container {
            position: relative;
            display: inline-block;
            text-align: center;
        }

        .meme-container img {
            object-fit: cover;
        }

        .meme-text {
            position: absolute;
            left: 705px;
            top: 240px;
            width: 452px;
            height: 488px;
            color: black;
            font-family: 'Patrick Hand', cursive;
            font-size: 55px;
            font-weight: bold;
            text-align: center;
            word-wrap: break-word;
            line-height: 1.2;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            padding: 12px;
            box-sizing: border-box;
        }
    </style>
</head>
<body>

    <div class="meme-container">
        <img src="https://i.pinimg.com/originals/89/ab/c6/89abc6e42ffe2c34a50226fff3fa6cbf.jpg" alt="Meme Image">
        <div class="meme-text">${text}</div>
    </div>

</body>
</html>`
}, {
  html: text => `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meme Generator</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap');

        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f4f4f4;
        }

        .meme-container {
            position: relative;
            display: inline-block;
            text-align: center;
        }

        .meme-container img {
            object-fit: cover;
        }

        .meme-text {
            position: absolute;
            left: 64px;
            transform: rotate(-4deg);
            top: 274px;
            width: 173px;
            height: 93px;
            color: black;
            font-family: 'Patrick Hand', cursive;
            font-size: 20px;
            font-weight: bold;
            text-align: center;
            word-wrap: break-word;
            line-height: 1.0;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            padding: 3px;
            box-sizing: border-box;
        }
    </style>
</head>
<body>

    <div class="meme-container">
        <img src="https://i.pinimg.com/originals/f7/e6/60/f7e660e632c8382ac2d524c504e50dcc.png" alt="Meme Image">
        <div class="meme-text">${text}</div>
    </div>

</body>
</html>`
}, {
  html: text => `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meme Generator</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap');

        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f4f4f4;
        }

        .meme-container {
            position: relative;
            display: inline-block;
            text-align: center;
        }

        .meme-container img {
            object-fit: cover;
        }

        .meme-text {
            position: absolute;
            left: 190px;
            transform: rotate(-4deg);
            top: 440px;
            width: 410px;
            height: 381px;
            color: black;
            font-family: 'Patrick Hand', cursive;
            font-size: 50px;
            font-weight: bold;
            text-align: center;
            word-wrap: break-word;
            line-height: 1.15;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            padding: 10px;
            box-sizing: border-box;
        }
    </style>
</head>
<body>

    <div class="meme-container">
        <img src="https://i.pinimg.com/originals/f4/b6/99/f4b69979d8f56fcf37f2553dcd877a53.jpg" alt="Meme Image">
        <div class="meme-text">${text}</div>
    </div>

</body>
</html>`
}, {
  html: text => `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meme Generator</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap');

        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f4f4f4;
        }

        .meme-container {
            position: relative;
            display: inline-block;
            text-align: center;
        }

        .meme-container img {
            object-fit: cover;
        }

        .meme-text {
            position: absolute;
            left: 68px;
            transform: rotate(-9deg);
            top: 327px;
            width: 399px;
            height: 233px;
            color: black;
            font-family: 'Patrick Hand', cursive;
            font-size: 30px;
            font-weight: bold;
            text-align: center;
            word-wrap: break-word;
            line-height: 1.1;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            padding: 8px;
            box-sizing: border-box;
        }
    </style>
</head>
<body>

    <div class="meme-container">
        <img src="https://i.pinimg.com/originals/17/c3/af/17c3afdac42bb0d7a47fd57a94a505c5.jpg" alt="Meme Image">
        <div class="meme-text">${text}</div>
    </div>

</body>
</html>`
}, {
  html: text => `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meme Generator</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap');

        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f4f4f4;
        }

        .meme-container {
            position: relative;
            display: inline-block;
            text-align: center;
        }

        .meme-container img {
            object-fit: cover;
        }

        .meme-text {
            position: absolute;
            left: 50px;
            top: 343px;
            width: 428px;
            height: 320px;
            color: black;
            font-family: 'Patrick Hand', cursive;
            font-size: 55px;
            font-weight: bold;
            text-align: center;
            word-wrap: break-word;
            line-height: 1.15;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            padding: 10px;
            box-sizing: border-box;
        }
    </style>
</head>
<body>

    <div class="meme-container">
        <img src="https://i.pinimg.com/originals/85/40/35/854035ae105052ac5da4331c5d5c2551.jpg" alt="Meme Image">
        <div class="meme-text">${text}</div>
    </div>

</body>
</html>`
}, {
  html: text => `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meme Generator</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap');

        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f4f4f4;
        }

        .meme-container {
            position: relative;
            display: inline-block;
            text-align: center;
        }

        .meme-container img {
            object-fit: cover;
        }

        .meme-text {
            position: absolute;
            left: 241px;
            top: 307px;
            width: 253px;
            height: 163px;
            color: black;
            font-family: 'Patrick Hand', cursive;
            font-size: 38px;
            font-weight: bold;
            text-align: center;
            word-wrap: break-word;
            line-height: 1.15;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            padding: 10px;
            box-sizing: border-box;
        }
    </style>
</head>
<body>

    <div class="meme-container">
        <img src="https://c.termai.cc/i172/LpJ.jpeg" alt="Meme Image">
        <div class="meme-text">${text}</div>
    </div>

</body>
</html>`
}];
const getTemplate = ({
  template: index = 1,
  text
}) => {
  const templateIndex = Number(index);
  return templates[templateIndex - 1]?.html(text) || "Template tidak ditemukan";
};
export default getTemplate;