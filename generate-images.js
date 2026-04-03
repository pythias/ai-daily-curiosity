#!/usr/bin/env node
/**
 * 每日好奇 - 批量生成缺失图片
 * 用法: node generate-images.js
 *
 * 需要设置环境变量 MINIMAX_API_KEY
 * 生成的图片自动保存到 src/images/YYYY-MM/YYYY-MM-DD.jpg
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { URL } = require('url');

// ========== 配置 ==========
const API_KEY = process.env.MINIMAX_API_KEY;
const BASE_DIR = path.join(__dirname, 'src', 'images');
// =========================

if (!API_KEY) {
  console.error('请设置环境变量 MINIMAX_API_KEY');
  process.exit(1);
}

// 所有需要生成的图片：日期 -> prompt
const tasks = [
  // ---- 2月 ----
  {
    date: '2026-02-16',
    prompt: 'Hand-drawn binary numbers illustration, digit 0 and 1 on electrical switch on off states, flowing current symbols, bytes forming into text characters A-B-C diagram, simple computer processor circuit, infographic style, ink sketch, blue and green tones'
  },
  {
    date: '2026-02-15',
    prompt: 'Hand-drawn AI chess illustration, computer screen showing Go board with black and white stones, neural network pattern in background, AlphaGo vs human match diagram, reinforcement learning concept, AI algorithm flowchart, ink sketch style, blue tones'
  },
  {
    date: '2026-02-20',
    prompt: 'Hand-drawn robot balancing diagram, stick figure robot wobbling on one leg, gyroscope icon showing tilt detection, inner ear vestibular system comparison for human balance, motion sensors labeled, comic style robot fall moment, ink sketch, blue and gray tones'
  },
  {
    date: '2026-02-21',
    prompt: 'Hand-drawn Caesar cipher illustration, Roman letters A-B-C with arrow shifting by 3 positions, HELLO becoming KHOOR example, encryption wheel diagram, ancient Roman scroll style, simple infographic, warm beige tones, ink sketch'
  },
  {
    date: '2026-02-22',
    prompt: 'Hand-drawn smartphone touch screen illustration, finger touching screen with electric field lines visible, capacitive sensor grid pattern underneath, small current flow diagram at touch point, touchscreen layers cross-section, infographic style, ink sketch, blue tones'
  },
  {
    date: '2026-02-23',
    prompt: 'Hand-drawn self-driving car illustration, car with sensor dome on roof, LiDAR laser beams scanning surroundings, simple road scene with pedestrian and traffic lights, perception diagram overlay, infographic style, ink sketch, blue and white tones'
  },
  {
    date: '2026-02-24',
    prompt: 'Hand-drawn 3D printer illustration, layered object being printed filament layer by layer, simple shows FDM technology, plastic filament going into nozzle, geometric cube being built layer by layer, infographic style, ink sketch, warm orange tones'
  },
  {
    date: '2026-02-25',
    prompt: 'Hand-drawn solar panel infographic, blue solar panels on rooftop, silicon crystal structure diagram with light photons hitting, electron flow illustration, label showing blue light reflection optimization, simple diagram style, warm sun tones, ink sketch'
  },
  {
    date: '2026-02-26',
    prompt: 'Hand-drawn quantum computing illustration, qubit shown as spinning coin in superposition state both 0 and 1 simultaneously, quantum computer chip diagram at near absolute zero temperature, wave function visualization, atom icon, infographic style, cool blue tones, ink sketch'
  },
  {
    date: '2026-02-27',
    prompt: 'Hand-drawn blockchain infographic, chain of blocks with transaction data, Bitcoin logo, mysterious hooded figure with question mark representing creator, digital currency symbols, distributed network nodes diagram, ink sketch style, warm gold and blue tones'
  },
  {
    date: '2026-02-28',
    prompt: 'Hand-drawn pixel art to realistic 3D game evolution diagram, 8-bit game character, early polygon graphics, modern ray-traced game scene, timeline arrows showing 40 years progression, infographic style, ink sketch, gaming controller icons, clean illustration'
  },

  // ---- 1月 ----
  {
    date: '2026-01-01',
    prompt: 'Hand-drawn Chinese university illustration, Tsinghua University campus with famous archway, Romanization of Chinese characters diagram showing Tsinghua vs Qinghua comparison, Latin alphabet evolution, Chinese and English text, warm red and gold tones, ink sketch style'
  },
  {
    date: '2026-01-02',
    prompt: 'Hand-drawn ketchup medicine history illustration, vintage medicine bottle labeled tomato ketchup cure, old pharmacy bottle, jar of tomato sauce, historical patent medicine advertisement style, infographic diagram showing evolution from medicine to condiment, warm brown tones, ink sketch'
  },
  {
    date: '2026-01-03',
    prompt: 'Hand-drawn polar bear illustration, close up of black bear nose and paw revealing black skin, cross-section of hollow white hair structure diagram showing air inside, magnification diagram, polar bear on ice, infographic style, ink sketch, white and blue tones'
  },
  {
    date: '2026-01-04',
    prompt: 'Hand-drawn狼狈为奸illustration, wolf walking with strange creature ba on its back with short front legs, ancient Chinese book illustration style, confused villagers looking at strange animal, classical Chinese painting aesthetic, warm beige paper background, ink brush style'
  },
  {
    date: '2026-01-05',
    prompt: 'Hand-drawn penguin anatomy illustration, penguin skeleton showing knee joint hidden under feathers, cross-section diagram of feather layers revealing legs with knee, human knee comparison, penguin walking, infographic style, ink sketch, black white and orange tones'
  },
  {
    date: '2026-01-06',
    prompt: 'Hand-drawn Mozart composer illustration, classical music score manuscript, piano keyboard with hands playing, historical letter or document, portrait style sketch, musical notes floating, classical music atmosphere, ink sketch, warm sepia tones'
  },
  {
    date: '2026-01-07',
    prompt: 'Hand-drawn ancient Chinese bed furniture illustration, Tang Dynasty scholar sitting on raised platform bed not sleeping, classical Chinese interior with sitting couch, Chinese character 床 evolution diagram, well railing character meaning, ink brush style, warm beige tones'
  },
  {
    date: '2026-01-08',
    prompt: 'Hand-drawn octopus illustration showing three hearts diagram, blue blood color comparison with red blood, octopus with tentacles, cross-section showing three heart pump icons, ocean scene, infographic style, ink sketch, blue and teal tones'
  },
  {
    date: '2026-01-09',
    prompt: 'Hand-drawn English idiom illustration, speech bubbles comparing I am busy vs Im tied up vs I have my hands full, Chinese learner confused by static vs dynamic expression, simple character illustrations, infographic style, ink sketch, blue and yellow tones'
  },
  {
    date: '2026-01-10',
    prompt: 'Hand-drawn pyramid workers illustration, ancient Egyptian pyramid construction scene, paid workers with beer and bread wages, ancient papyrus pay slip labeled, archaeologist with bones in cemetery discovery, infographic style, ink sketch, warm sand and blue tones'
  },
  {
    date: '2026-01-11',
    prompt: 'Hand-drawn green beer bottles illustration, row of green beer bottles vs brown beer bottles, UV light rays being blocked by brown glass diagram, skunky smell symbol, Heineken green bottle as status symbol, infographic style, ink sketch, green and brown tones'
  },
  {
    date: '2026-01-12',
    prompt: 'Hand-drawn Chinese inventions illustration, compass as feng shui fengshui tool alongside navigation compass, geomancy compass with directional points, ancient Chinese scholarly study scene, Chinese characters, infographic style, ink sketch, warm earth tones'
  },
  {
    date: '2026-01-13',
    prompt: 'Hand-drawn platypus illustration, duck-billed platypus with electroreception sensors on bill diagram, comparing egg-laying mammal features, baby platypus hatching from egg while mother produces milk, Australian river scene, infographic style, ink sketch, warm brown and green tones'
  },
  {
    date: '2026-01-14',
    prompt: 'Hand-drawn coffee aroma illustration, hot coffee cup with steam smelling molecules traveling to nose diagram, smelling coffee beans vs drinking coffee comparison, flavor molecules in nasal passage, infographic style, ink sketch, warm brown and orange tones'
  },
  {
    date: '2026-01-15',
    prompt: 'Hand-drawn China time zone illustration, map of China showing vast territory from east to west, Xi an national time service center icon, time zone comparison showing Beijing vs Xinjiang time difference, geographic longitude lines, infographic style, ink sketch, warm red and blue tones'
  },
  {
    date: '2026-01-26',
    prompt: 'Hand-drawn magnet attracting iron illustration, electron spin diagram showing atomic magnetic moments aligning, magnet domains visualization, iron atoms with arrow showing magnetic direction, simple compass icon, infographic style, ink sketch, red and blue magnetic poles'
  },
  {
    date: '2026-01-27',
    prompt: 'Hand-drawn sleeping plants illustration,合欢mimosa leaves open in daytime and closed at night comparison, sunflower following sun path diagram, plant circadian rhythm graph showing 24 hour cycle, sleeping leaves, infographic style, ink sketch, green and yellow tones'
  },
  {
    date: '2026-01-28',
    prompt: 'Hand-drawn cola bubbles infographic, CO2 gas bubbles forming in stomach with burst effect, carbonated drink bubble diagram magnified, person drinking cola with satisfying burp, sports bottle, infographic style, ink sketch, brown and white tones'
  },
  {
    date: '2026-01-29',
    prompt: 'Hand-drawn penguin world map illustration, Antarctica penguin colony compared to Galapagos penguin on Equator, Humboldt cold current ocean flow arrow from Antarctica to Galapagos, simple world map showing penguin locations marked, infographic style, ink sketch, blue and orange tones'
  },
  {
    date: '2026-01-30',
    prompt: 'Hand-drawn AI recognizing cat illustration, neural network layers showing input image of cat, feature extraction edges shapes to abstract cat concept, compared to photo of dead cat causing AI confusion,吉娃娃 vs muffin comparison, layer diagram, infographic style, ink sketch, blue tones'
  },
  {
    date: '2026-01-31',
    prompt: 'Hand-drawn rocket fuel infographic, massive rocket with fuel tanks labeled 99% fuel vs 1% payload, Saturn V rocket launch comparing weight numbers, escape velocity diagram showing 7.9km/s to orbit, fuel efficiency comparison, infographic style, ink sketch, orange and gray tones'
  },

  // ---- 3月 ----
  {
    date: '2026-03-22',
    prompt: 'Hand-drawn Chinese city names with sun character illustration, map of China showing cities Luoyang Xiangyang Jiyang with their rivers marked, ancient Chinese city wall silhouettes, Chinese character 阳 meaning north of river explained with diagram, infographic style, ink sketch, warm beige tones'
  }
];

async function generateImage(prompt, date) {
  const month = date.slice(0, 7); // 2026-01
  const dir = path.join(BASE_DIR, month);
  const filePath = path.join(dir, `${date}.jpg`);

  // 确保目录存在
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // 检查是否已存在
  if (fs.existsSync(filePath)) {
    console.log(`[SKIP] ${date} already exists`);
    return;
  }

  console.log(`[GENERATE] ${date}...`);

  const payload = JSON.stringify({
    model: 'minimax/image-01',
    prompt: prompt,
    num_images: 1
  });

  const url = new URL('https://api.minimax.chat/v1/image_generation');
  url.searchParams.set('GroupId', process.env.MINIMAX_GROUP_ID || '');

  const options = {
    hostname: 'api.minimax.chat',
    path: `/v1/image_generation?GroupId=${process.env.MINIMAX_GROUP_ID || ''}`,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.data && result.data[0] && result.data[0].b64_json) {
            const imgBuffer = Buffer.from(result.data[0].b64_json, 'base64');
            fs.writeFileSync(filePath, imgBuffer);
            console.log(`[OK] ${date} saved to ${filePath}`);
            resolve();
          } else {
            console.error(`[FAIL] ${date}:`, JSON.stringify(result));
            resolve(); // 不阻塞其他任务
          }
        } catch (e) {
          console.error(`[ERROR] ${date}:`, e.message);
          resolve();
        }
      });
    });
    req.on('error', e => {
      console.error(`[NETWORK ERROR] ${date}:`, e.message);
      resolve();
    });
    req.write(payload);
    req.end();
  });
}

async function main() {
  console.log(`Total tasks: ${tasks.length}`);
  console.log(`Base directory: ${BASE_DIR}`);
  console.log('');

  for (const task of tasks) {
    await generateImage(task.prompt, task.date);
    await new Promise(r => setTimeout(r, 500)); // 避免限流
  }

  console.log('\nDone!');
}

main().catch(console.error);
