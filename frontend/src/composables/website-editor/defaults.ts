import { reactive } from 'vue';
import heroImageDefault from '@/assets/landing/intro.png';
import starterImageDefault from '@/assets/landing/playlearn.png';
import explorerImageDefault from '@/assets/landing/roboticcamp.png';
import masterImageDefault from '@/assets/landing/precompete.png';
import certificateDefault from '@/assets/landing/cretificate.jpg';
import promotionsPhotoDefault from '@/assets/landing/promotions.png';
import happyPlayTimePhotoDefault from '@/assets/landing/happyplaytime.png';
import exploringSpacePhotoDefault from '@/assets/landing/exploringspace.png';
import takeawayMicrobitPhotoDefault from '@/assets/landing/takeaway.png';
import takeawayPythonPhotoDefault from '@/assets/landing/takegreen.png';
import precompetePhotoDefault from '@/assets/landing/precompete.png';
import logoDefault from '@/assets/landing/logo.png';
import type {
  HeaderState,
  HeroState,
  BenefitsState,
  ActivityFormatsState,
  GalleryState,
  ActivityGalleryState,
  QuizState,
  BranchesState,
  CtaState,
  FooterState,
  PromotionsPageState,
  CoursesPageState,
  ResourcesPageState,
  AboutPageState,
  SectionNavItem,
  ImageSizeSpec,
  ActivePage,
  EditorLocale,
} from './types';

export const createInitialState = () => ({
  header: reactive<HeaderState>({
    logo: logoDefault,
    nav: {
      home: 'หน้าหลัก',
      promotions: 'โปรโมชั่น',
      courses: 'คอร์สเรียน',
      resources: 'คลังความรู้',
      about: 'เกี่ยวกับเรา',
    },
  }),
  hero: reactive<HeroState>({
    image: heroImageDefault,
    imageAlt: 'เด็ก ๆ เรียนรู้ผ่าน LEGO',
    titleHighlight: 'เล่นและเรียนรู้ผ่านการทำจริง',
    titleRest: 'ด้วยตัวต่อ LEGO',
    paragraph:
      'BotBuilder ประเทศไทยขอเสนอการเรียนรู้แบบลงมือปฏิบัติจริงด้วยการบูรณาการ ผสานความรู้ทางวิทยาศาสตร์ คณิตศาสตร์และศิลปศาสตร์ ผ่านการสร้างหุ่นยนต์และชุดอุปกรณ์ที่ออกแบบมาอย่างเหมาะสมสำหรับเด็กอายุ 3-16 ปี เพื่อเสริมทักษะ',
    skills: [
      'การคิดอย่างมีเหตุผล (Logical Thinking)',
      'การวางแผนการทำงาน (Planning)',
      'การวิเคราะห์และการแก้ไขปัญหา (Problem solving)',
      'งานโครงการและการนำเสนอ (Project based and Project presentation)',
    ],
    bookingNote:
      'จองรอบเข้ามาสัมผัสประสบการณ์กับการสร้างหุ่นยนต์กว่า 100 แบบได้ที่ BotBuilder เท่านั้น ผ่าน Line ID:',
    ctaLabel: 'จองรอบทดลองเรียนฟรี',
    ctaBangsaen: 'สาขาบางแสน',
    ctaSriracha: 'สาขาศรีราชา',
  }),
  benefits: reactive<BenefitsState>({
    heading: 'ทำไมต้องเรียนกับเรา?',
    items: [
      {
        icon: 'pan_tool',
        title: 'HANDS-ON LEARNING',
        text: 'เน้นการลงมือทำจริงมากกว่าแค่ทฤษฎี เด็ก ๆ จะได้สร้างหุ่นยนต์และโปรแกรมด้วยตัวเองตั้งแต่ชั่วโมงแรก',
      },
      {
        icon: 'school',
        title: 'CERTIFIED MENTORS',
        text: 'สอนโดยผู้เชี่ยวชาญด้านหุ่นยนต์และการศึกษา STEM ที่ได้รับการรับรอง มีประสบการณ์ตรงกับเด็ก',
      },
      {
        icon: 'rocket_launch',
        title: 'FUTURE SKILLS',
        text: 'เตรียมความพร้อมสู่ศตวรรษที่ 21 ด้วยทักษะการคิดเชิงวิพากษ์ และการแก้ไขปัญหาที่ซับซ้อน',
      },
    ],
  }),
  activityFormats: reactive<ActivityFormatsState>({
    heading: 'รูปแบบกิจกรรม',
    items: [
      {
        image: starterImageDefault,
        title: 'เล่น เรียน สร้าง',
        description:
          'มุ่งเน้นความหลากหลายของแบบหุ่นยนต์ ความคิดสร้างสรรค์ การเขียนโปรแกรมพื้นฐานและการนำเสนอผลงาน โดยมีความสอดคล้องกับอายุ ความสนใจและความสามารถของน้องแบ่งออกเป็น 3 ระดับ Beginner Intermediate และ Advance',
      },
      {
        image: explorerImageDefault,
        title: 'ค่ายหุ่นยนต์',
        description:
          'มุ่งเน้นกิจกรรมภารกิจ การวางแผนและการทำงานเป็นทีม ภารกิจจะเป็นเครื่องกำหนดรูปแบบของหุ่นยนต์ ทำให้น้อง ๆ ต้องมีการออกแบบและสร้างขึ้นใหม่ตามรูปแบบกิจกรรมในแต่ละครั้ง และสามารถจัดแบบนอกสถานที่เพื่อสร้างความแปลกใหม่',
      },
      {
        image: masterImageDefault,
        title: 'เตรียมการแข่งขัน',
        description:
          'มุ่งเน้นการออกแบบและสร้างหุ่นยนต์เพื่อการแข่งขันโดยเฉพาะ เน้นการคิดเพื่อแก้ไขปัญหาและการซ้อมเพื่อสร้างโอกาสชนะในการแข่งขัน โดยมีรายการแข่งขัน เช่น LEGO FLL, World Robot Olympiad™ และ Robot Battle เป็นต้น',
      },
    ],
  }),
  gallery: reactive<GalleryState>({
    heading: 'ผลงานและประกาศนียบัตร',
    paragraph:
      'เด็ก ๆ ได้สร้างผลงานที่เป็นเอกลักษณ์และภาคภูมิใจ พร้อมรับประกาศนียบัตรเพื่อยืนยันการเรียนรู้ในทุกระดับ',
    courseCertified: 'Course Certified',
    skillBadges: 'Skill Badges',
    imageAlt: 'ผลงานนักเรียน Bot Builder',
    certificateImage: certificateDefault,
  }),
  activityGallery: reactive<ActivityGalleryState>({
    heading: 'รวมภาพกิจกรรมใน BotBuilder',
    groups: [
      {
        title: 'กิจกรรมภายใน',
        photos: [
          {
            src: promotionsPhotoDefault,
            alt: 'กิจกรรมโปรโมชั่นของ BotBuilder',
          },
          { src: happyPlayTimePhotoDefault, alt: 'กิจกรรม Happy Play Time' },
          {
            src: precompetePhotoDefault,
            alt: 'เตรียมความพร้อมสู่การแข่งขันหุ่นยนต์',
          },
        ],
      },
      {
        title: 'กิจกรรมนอกสถานที่',
        photos: [
          {
            src: exploringSpacePhotoDefault,
            alt: 'ค่ายปิดเทอม: สำรวจอวกาศ',
          },
          { src: takeawayMicrobitPhotoDefault, alt: 'Robot Takeaway Course with Microbit' },
          { src: takeawayPythonPhotoDefault, alt: 'Robot Takeaway Course with Python' },
        ],
      },
    ],
  }),
  quiz: reactive<QuizState>({
    heading: 'ทดสอบความรู้หุ่นยนต์!',
    paragraph: 'ลองทำแบบทดสอบสนุก ๆ เพื่อดูว่าคุณรู้จัก LEGO Spike Prime ดีแค่ไหน',
    cta: 'TAKE THE QUIZ →',
    questions: [
      {
        question: 'LEGO Spike Prime ใช้ซอฟต์แวร์ภาษาอะไรในการเขียนโปรแกรมแบบบล็อก?',
        options: ['Scratch / Python', 'C++', 'HTML', 'Java'],
        correctIndex: 0,
      },
      {
        question: 'เซนเซอร์วัดระยะทาง (Distance Sensor) ใช้หลักการใดในการตรวจจับวัตถุ?',
        options: ['แสงอินฟราเรด', 'คลื่นอัลตราโซนิก (Ultrasonic)', 'คลื่นวิทยุ', 'แม่เหล็ก'],
        correctIndex: 1,
      },
      {
        question: 'มอเตอร์ของ LEGO Spike Prime มีเซนเซอร์ตรวจจับอะไรในตัว?',
        options: ['อุณหภูมิ', 'ความชื้น', 'มุมและการหมุน (Rotation Sensor)', 'ความดัน'],
        correctIndex: 2,
      },
      {
        question: 'ฮับ (Hub) ของ Spike Prime มีหน้าจอแสดงผลแบบใด?',
        options: ['LCD Color Screen', 'LED Grid 5x5', 'OLED Screen', 'ไม่มีหน้าจอ'],
        correctIndex: 1,
      },
      {
        question: 'เมื่อต้องการให้หุ่นยนต์หยุดทำงานทันทีเมื่อชนสิ่งกีดขวาง ควรใช้เซนเซอร์ใด?',
        options: ['Color Sensor', 'Distance Sensor', 'Force Sensor (เซนเซอร์แรงกด)', 'Gyro Sensor'],
        correctIndex: 2,
      },
    ],
  }),
  branches: reactive<BranchesState>({
    heading: 'สาขาของเรา',
    items: [
      {
        name: 'สาขาบางแสน',
        address: 'บางแสน จังหวัดชลบุรี',
        description:
          'สาขาหลักของ BotBuilder Thailand อยู่ติดกับโรงเรียนสาธิตพิบูลบำเพ็ญ มหาวิทยาลัยบูรพา ใกล้กับแหล่งท่องเที่ยวและร้านอาหารดัง ๆ มากมาย',
        hours: [
          { days: 'อังคาร - ศุกร์', time: '14.30 - 19.00 น.' },
          { days: 'เสาร์ - อาทิตย์', time: '8.00 - 18.00 น.' },
        ],
        phone: '082-459-5665',
        contactName: 'อุ๋ม',
        mapEmbedUrl:
          'https://www.google.com/maps/embed?pb=!1m13!1m8!1m3!1d3884.930516016332!2d100.934786!3d13.166781!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTPCsDEwJzAwLjUiTiAxMDDCsDU2JzA1LjMiRQ!5e0!3m2!1sth!2sus!4v1785420473849!5m2!1sth!2sus',
      },
      {
        name: 'สาขาศรีราชา',
        address: 'ห้างอิออนศรีราชา ชั้น 3 (หน้าลิฟท์)',
        description: 'สาขาที่ 2 ของ BotBuilder ประจำอำเภอศรีราชา ด้านข้างโรงเรียนอัสสัมชัญศรีราชา',
        hours: [
          { days: 'อังคาร - ศุกร์', time: '14.30 - 19.00 น.' },
          { days: 'เสาร์ - อาทิตย์', time: '8.00 - 18.00 น.' },
        ],
        phone: '095-362-5366',
        contactName: 'กัน',
        mapEmbedUrl:
          'https://www.google.com/maps/embed?pb=!1m13!1m8!1m3!1d3875.79482217073!2d100.9325961085095!3d13.167610042568008!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTPCsDEwJzAwLjUiTiAxMDDCsDU2JzA1LjMiRQ!5e0!3m2!1sth!2sus!4v1785420269794!5m2!1sth!2sus',
      },
    ],
  }),
  cta: reactive<CtaState>({
    heading: 'พร้อมเริ่มก้าวแรกไปกับเราหรือยัง?',
    paragraph:
      'ลงทะเบียนวันนี้เพื่อรับสิทธิ์เข้าทดลองเรียนฟรี 1 ครั้ง พร้อมคำแนะนำจากผู้เชี่ยวชาญเพื่อเลือกคอร์สที่เหมาะสมที่สุดสำหรับบุตรหลานของคุณ',
    button: 'ลงทะเบียนเรียนฟรี',
  }),
  footer: reactive<FooterState>({
    brandTitle: 'BOT BUILDER',
    brandText:
      'ศูนย์การเรียนรู้หุ่นยนต์และนวัตกรรมสำหรับเด็ก ที่เชื่อว่าการเรียนรู้ที่ดีที่สุดคือการสร้างสรรค์ด้วยมือของตัวเอง',
    quickLinks: 'ลิงก์ด่วน',
    courses: 'คอร์สเรียน',
    aboutUs: 'เกี่ยวกับเรา',
    resources: 'คลังความรู้',
    support: 'ช่วยเหลือ',
    promotion: 'โปรโมชั่น',
    copyright: '© 2024 Bot Builder Academy. Built for future engineers.',
  }),
  promotionsPage: reactive<PromotionsPageState>({
    eyebrow: 'PROMOTIONS',
    title: 'โปรโมชั่น',
    subtitle: 'สิทธิพิเศษและคอร์สเรียนสนุก ๆ จาก Bot Builder',
    listHeading: 'โปรโมชั่นและกิจกรรม',
    items: [
      {
        label: 'สิทธิพิเศษ',
        title: 'Promotion สำหรับสมาชิก Bot Builder',
        description: ['ซื้อชั่วโมงเรียน 30 ชม.', 'แถมฟรีทันที 6 ชม.'],
        details: ['หรือ เลือกรับส่วนลดค่าเรียน 10%'],
        price: 'ราคา 15,000 บาท',
        note: '*เงื่อนไขเป็นไปตามที่บริษัทฯ กำหนด',
        likeText: 'ชอบโปรโมชั่นนี้ กดไลก์เพจได้ที่',
        likeLabel: 'BotBuilderThailand',
        likeUrl: 'https://www.facebook.com/BotBuilderThailand/',
        image: promotionsPhotoDefault,
      },
      {
        label: 'กิจกรรมพิเศษ',
        title: 'Happy Play Time',
        description: [
          'กิจกรรมต้อนรับปิดเทอม ชวนน้อง ๆ มาสนุกกับการต่อเลโก้และฝึกเขียนโปรแกรมควบคุมหุ่นยนต์',
          'สร้างทักษะความคิดสร้างสรรค์และการแก้ปัญหาผ่านภารกิจสนุก ๆ',
        ],
        details: ['สำหรับน้อง ๆ อายุ 4 - 12 ปี', 'รอบละ 2 ชั่วโมง (จำกัดจำนวนผู้เรียนต่อรอบ)'],
        price: 'ราคา 890 บาท / รอบ',
        note: '*รวมอุปกรณ์และชีทกิจกรรมเรียบร้อยแล้ว',
        image: happyPlayTimePhotoDefault,
      },
      {
        label: 'Holiday Camp',
        title: 'Exploring Space with LEGO Robotics',
        description: [
          'ค่ายหุ่นยนต์ตะลุยอวกาศ 3 วันเต็ม! เรียนรู้การสร้างหุ่นยนต์สปายแวร์ หุ่นยนต์สำรวจดาวอังคาร และฐานปล่อยจรวด',
        ],
        details: [
          'วันที่ 15 - 17 ตุลาคม 2567',
          'เวลา 09:00 - 15:30 น.',
          'รับเกียรติบัตรเข้าร่วมกิจกรรมพร้อมผลงานสะสม',
        ],
        price: 'ราคา 4,500 บาท (รวมอาหารกลางวัน)',
        image: exploringSpacePhotoDefault,
      },
      {
        label: 'Takeaway Course',
        title: 'Takeaway Robot Course (Micro:bit)',
        description: [
          'คอร์สเรียนพิเศษที่น้อง ๆ จะได้ประกอบหุ่นยนต์และเขียนโค้ดควบคุมด้วยบอร์ด Micro:bit',
          'เมื่อเรียนจบสามารถนำหุ่นยนต์กลับบ้านไปฝึกต่อได้ทันที!',
        ],
        details: ['เหมาะสำหรับน้อง ๆ อายุ 8 ปีขึ้นไป', 'เรียน 4 ครั้ง ครั้งละ 2 ชั่วโมง'],
        price: 'ราคา 6,900 บาท (ฟรีชุดหุ่นยนต์กลับบ้าน)',
        image: takeawayMicrobitPhotoDefault,
      },
      {
        label: 'Takeaway Course',
        title: 'Python Robotics Takeaway',
        description: [
          'ต่อยอดการเขียนโปรแกรมด้วยภาษา Python ควบคุมเซนเซอร์และมอเตอร์หุ่นยนต์ระดับสูง',
        ],
        details: ['สำหรับน้อง ๆ ที่มีพื้นฐานการเขียนโปรแกรมบล็อก', 'รวมอุปกรณ์ฮาร์ดแวร์กลับบ้าน'],
        price: 'ราคา 7,900 บาท',
        image: takeawayPythonPhotoDefault,
      },
    ],
    cta: {
      eyebrow: 'สอบถามรายละเอียดเพิ่มเติม',
      heading: 'ทักแชตเพจเพื่อรับสิทธิ์และจองรอบเรียน',
      button: 'ส่งข้อความทาง Facebook',
    },
  }),
  coursesPage: reactive<CoursesPageState>({
    eyebrow: 'BOT BUILDER COURSES',
    title: 'หลักสูตรที่ออกแบบมาเพื่อเด็กแต่ละช่วงวัย',
    paragraph: 'เลือกเส้นทางการเรียนรู้ที่เหมาะกับความสนใจและระดับทักษะของบุตรหลาน',
    buttonText: 'ดูรายละเอียดเพิ่มเติม',
    items: [
      {
        badge: 'อายุ 4 - 6 ปี',
        title: 'Starter Coders (รุ่นเยาว์)',
        description: [
          'เรียนรู้พื้นฐานกลไกอย่างง่ายผ่าน LEGO Education (WeDo & Spike Essential)',
          'ฝึกทักษะการสังเกต มิติสัมพันธ์ และลำดับขั้นตอนการทำงานอย่างเป็นระบบ',
        ],
        image: starterImageDefault,
      },
      {
        badge: 'อายุ 7 - 10 ปี',
        title: 'Explorer Bots (นักสำรวจ)',
        description: [
          'สร้างและเขียนโปรแกรมควบคุมหุ่นยนต์ด้วย Scratch & Block-based coding',
          'เรียนรู้การทำงานของเซนเซอร์ตรวจจับแสง เสียง และระยะทางผ่านภารกิจสนุก ๆ',
        ],
        image: explorerImageDefault,
      },
      {
        badge: 'อายุ 11 - 16 ปี',
        title: 'Master Engineers (วิศวกรน้อย)',
        description: [
          'ออกแบบหุ่นยนต์ระดับสูงด้วย LEGO Spike Prime และการเขียนโค้ดด้วย Python',
          'เตรียมความพร้อมก้าวสู่การแข่งขันหุ่นยนต์ระดับประเทศและนานาชาติ (FLL / WRO)',
        ],
        image: masterImageDefault,
      },
    ],
  }),
  resourcesPage: reactive<ResourcesPageState>({
    eyebrow: 'LEARN & EXPLORE',
    title: 'แหล่งเรียนรู้สำหรับนักสร้างตัวน้อย',
    paragraph: 'บทความ กิจกรรม และโจทย์สนุก ๆ ที่ช่วยต่อยอดการเรียนรู้ด้านหุ่นยนต์',
    items: [
      {
        icon: 'article',
        title: 'คู่มือการใช้งาน LEGO Spike Prime เบื้องต้น',
        text: 'รวมเทคนิคการประกอบโครงสร้างและการใช้เซนเซอร์ที่น้อง ๆ ควรรู้ก่อนเริ่มสร้างหุ่นยนต์ตัวแรก',
      },
      {
        icon: 'extension',
        title: '10 โจทย์ท้าทายเขียนโค้ด Scratch สำหรับเด็ก',
        text: 'ฝึกตรรกะการคิดแก้ปัญหาด้วยมินิเกมและภารกิจควบคุมตัวละครอย่างสนุกสนาน',
      },
      {
        icon: 'emoji_events',
        title: 'แนวทางการเตรียมตัวสอบแข่งขันหุ่นยนต์ FLL',
        text: 'เคล็ดลับจากรุ่นพี่ที่เคยผ่านเวทีแข่งขันจริง ทั้งการวางแผน การนำเสนอ และการลุยภารกิจสนาม',
      },
    ],
  }),
  aboutPage: reactive<AboutPageState>({
    eyebrow: 'ABOUT BOT BUILDER',
    title: 'เราเชื่อว่าการเรียนรู้ที่ดีที่สุด คือการได้ลงมือสร้าง',
    intro: 'Bot Builder สร้างพื้นที่การเรียนรู้ที่เด็ก ๆ ได้ทดลอง คิด และเติบโตไปพร้อมกับเทคโนโลยี',
    missionHeading: 'พันธกิจของเรา',
    missionText:
      'เราพัฒนาทักษะแห่งอนาคตผ่านการเรียนรู้ด้านวิทยาศาสตร์ เทคโนโลยี วิศวกรรมศาสตร์ และคณิตศาสตร์อย่างสนุกสนาน',
    image: heroImageDefault,
    imageAlt: 'เกี่ยวกับ BotBuilder',
  }),
});

export const createInitialEnState = () => ({
  header: reactive<HeaderState>({
    logo: logoDefault,
    nav: {
      home: 'Home',
      promotions: 'Promotions',
      courses: 'Courses',
      resources: 'Resources',
      about: 'About Us',
    },
  }),
  hero: reactive<HeroState>({
    image: heroImageDefault,
    imageAlt: 'Children learning with LEGO',
    titleHighlight: 'Play & Learn Through Hands-On Experience',
    titleRest: 'With LEGO Bricks',
    paragraph:
      'BotBuilder Thailand offers hands-on STEM learning combining Science, Math, and Art through robot building sets designed for kids aged 3-16 to build essential future skills.',
    skills: [
      'Logical Thinking',
      'Planning & Organization',
      'Problem Solving & Analysis',
      'Project-Based Learning & Presentation',
    ],
    bookingNote:
      'Book a trial session to build over 100 robot models only at BotBuilder via Line ID:',
    ctaLabel: 'Book Free Trial Class',
    ctaBangsaen: 'Bangsaen Branch',
    ctaSriracha: 'Sriracha Branch',
  }),
  benefits: reactive<BenefitsState>({
    heading: 'Why Learn With Us?',
    items: [
      {
        icon: 'pan_tool',
        title: 'HANDS-ON LEARNING',
        text: 'Focus on actual practice over theory. Kids build and program robots from their very first hour.',
      },
      {
        icon: 'school',
        title: 'CERTIFIED MENTORS',
        text: 'Taught by certified STEM and robotics experts with direct experience working with children.',
      },
      {
        icon: 'rocket_launch',
        title: 'FUTURE SKILLS',
        text: 'Prepare for the 21st century with critical thinking and complex problem-solving skills.',
      },
    ],
  }),
  activityFormats: reactive<ActivityFormatsState>({
    heading: 'Activity Formats',
    items: [
      {
        image: starterImageDefault,
        title: 'Play, Learn, Create',
        description:
          'Focuses on robotics variety, creativity, basic programming, and presentation tailored to age and skill levels: Beginner, Intermediate, and Advance.',
      },
      {
        image: explorerImageDefault,
        title: 'Robotics Camp',
        description:
          'Focuses on mission activities, planning, and teamwork. Missions define robot design requiring creative rebuilds for each camp.',
      },
      {
        image: masterImageDefault,
        title: 'Competition Prep',
        description:
          'Dedicated robot design and programming for competitions like LEGO FLL, World Robot Olympiad™, and Robot Battle.',
      },
    ],
  }),
  gallery: reactive<GalleryState>({
    heading: 'Student Works & Certificates',
    paragraph:
      'Children create unique projects they are proud of, earning certificates at every level.',
    courseCertified: 'Course Certified',
    skillBadges: 'Skill Badges',
    imageAlt: 'BotBuilder Student Project',
    certificateImage: certificateDefault,
  }),
  activityGallery: reactive<ActivityGalleryState>({
    heading: 'BotBuilder Activity Gallery',
    groups: [
      {
        title: 'Internal Activities',
        photos: [
          { src: promotionsPhotoDefault, alt: 'BotBuilder Promotional Activity' },
          { src: happyPlayTimePhotoDefault, alt: 'Happy Play Time Activity' },
          { src: precompetePhotoDefault, alt: 'Robotics Competition Preparation' },
        ],
      },
      {
        title: 'Outdoor Camps',
        photos: [
          { src: exploringSpacePhotoDefault, alt: 'Holiday Camp: Space Exploration' },
          { src: takeawayMicrobitPhotoDefault, alt: 'Robot Takeaway Course with Microbit' },
          { src: takeawayPythonPhotoDefault, alt: 'Robot Takeaway Course with Python' },
        ],
      },
    ],
  }),
  quiz: reactive<QuizState>({
    heading: 'Test Your Robotics Knowledge!',
    paragraph: 'Take a fun quiz to see how well you know LEGO Spike Prime.',
    cta: 'TAKE THE QUIZ →',
    questions: [
      {
        question: 'What programming language is LEGO Spike Prime block coding based on?',
        options: ['Scratch / Python', 'C++', 'HTML', 'Java'],
        correctIndex: 0,
      },
      {
        question: 'What technology does the Distance Sensor use to detect objects?',
        options: ['Infrared Light', 'Ultrasonic Waves', 'Radio Waves', 'Magnetic Fields'],
        correctIndex: 1,
      },
      {
        question: 'What built-in sensor is integrated inside LEGO Spike Prime motors?',
        options: [
          'Temperature Sensor',
          'Humidity Sensor',
          'Rotation / Angle Sensor',
          'Pressure Sensor',
        ],
        correctIndex: 2,
      },
      {
        question: 'What type of display screen does the Spike Prime Hub feature?',
        options: ['LCD Color Screen', '5x5 LED Matrix Grid', 'OLED Screen', 'No Screen'],
        correctIndex: 1,
      },
      {
        question: 'Which sensor detects physical contact/pushing to trigger actions?',
        options: ['Color Sensor', 'Distance Sensor', 'Force Sensor', 'Gyro Sensor'],
        correctIndex: 2,
      },
    ],
  }),
  branches: reactive<BranchesState>({
    heading: 'Our Branches',
    items: [
      {
        name: 'Bangsaen Branch',
        address: 'Bangsaen, Chonburi',
        description:
          'Main branch next to Demonstration School of Burapha University, near major attractions and popular restaurants.',
        hours: [
          { days: 'Tue - Fri', time: '14:30 - 19:00' },
          { days: 'Sat - Sun', time: '08:00 - 18:00' },
        ],
        phone: '082-459-5665',
        contactName: 'Oum',
        mapEmbedUrl:
          'https://www.google.com/maps/embed?pb=!1m13!1m8!1m3!1d3884.930516016332!2d100.934786!3d13.166781!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTPCsDEwJzAwLjUiTiAxMDDCsDU2JzA1LjMiRQ!5e0!3m2!1sth!2sus!4v1785420473849!5m2!1sth!2sus',
      },
      {
        name: 'Sriracha Branch',
        address: 'AEON Sriracha 3rd Floor (Front of Elevator)',
        description: 'Second branch in Sriracha, located next to Assumption College Sriracha.',
        hours: [
          { days: 'Tue - Fri', time: '14:30 - 19:00' },
          { days: 'Sat - Sun', time: '08:00 - 18:00' },
        ],
        phone: '095-362-5366',
        contactName: 'Gun',
        mapEmbedUrl:
          'https://www.google.com/maps/embed?pb=!1m13!1m8!1m3!1d3875.79482217073!2d100.9325961085095!3d13.167610042568008!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTPCsDEwJzAwLjUiTiAxMDDCsDU2JzA1LjMiRQ!5e0!3m2!1sth!2sus!4v1785420269794!5m2!1sth!2sus',
      },
    ],
  }),
  cta: reactive<CtaState>({
    heading: 'Ready to Take the First Step?',
    paragraph:
      'Register today for a free 1-session trial class with expert consultation to choose the best course for your child.',
    button: 'REGISTER NOW',
  }),
  footer: reactive<FooterState>({
    brandTitle: 'BOT BUILDER',
    brandText:
      'Robotics and Innovation Learning Center for kids, believing the best learning comes from creating with own hands.',
    quickLinks: 'QUICK LINKS',
    courses: 'Courses',
    aboutUs: 'About Us',
    resources: 'Resources',
    support: 'SUPPORT',
    promotion: 'Promotion',
    copyright: '© 2024 Bot Builder Academy. Built for future engineers.',
  }),
  promotionsPage: reactive<PromotionsPageState>({
    eyebrow: 'PROMOTIONS',
    title: 'Promotions',
    subtitle: 'Special privileges and fun courses from Bot Builder',
    listHeading: 'Promotions & Activities',
    items: [
      {
        label: 'Special Offer',
        title: 'Bot Builder Member Promotion',
        description: ['Buy 30 learning hours', 'Get 6 hours free instantly!'],
        details: ['Or choose a 10% tuition discount'],
        price: '15,000 THB',
        note: '*Terms & conditions apply',
        likeText: 'Like this deal? Visit our Facebook page at',
        likeLabel: 'BotBuilderThailand',
        likeUrl: 'https://www.facebook.com/BotBuilderThailand/',
        image: promotionsPhotoDefault,
      },
      {
        label: 'Special Activity',
        title: 'Happy Play Time',
        description: [
          'School break activity inviting kids to enjoy LEGO building and robot coding!',
          'Boost creativity and problem-solving through fun missions.',
        ],
        details: ['For kids aged 4 - 12 years', '2 hours per session (Limited seats)'],
        price: '890 THB / session',
        note: '*Equipment and activity sheets included',
        image: happyPlayTimePhotoDefault,
      },
      {
        label: 'Holiday Camp',
        title: 'Exploring Space with LEGO Robotics',
        description: [
          '3-day space robotics camp! Learn to build rover bots, Mars explorers, and launch pads.',
        ],
        details: [
          'October 15 - 17, 2024',
          '09:00 - 15:30',
          'Certificate of completion & portfolio items included',
        ],
        price: '4,500 THB (Includes lunch)',
        image: exploringSpacePhotoDefault,
      },
      {
        label: 'Takeaway Course',
        title: 'Takeaway Robot Course (Micro:bit)',
        description: [
          'Special course where students assemble robots and code with Micro:bit controller.',
          'Take the robot home upon course completion to keep practicing!',
        ],
        details: ['Suitable for ages 8+', '4 sessions, 2 hours each'],
        price: '6,900 THB (Includes takeaway robot kit)',
        image: takeawayMicrobitPhotoDefault,
      },
      {
        label: 'Takeaway Course',
        title: 'Python Robotics Takeaway',
        description: ['Advanced programming with Python controlling sensors and motors.'],
        details: [
          'For students with block-coding background',
          'Hardware kit included to take home',
        ],
        price: '7,900 THB',
        image: takeawayPythonPhotoDefault,
      },
    ],
    cta: {
      eyebrow: 'Inquire For Details',
      heading: 'Message our Facebook page to claim promotion and book classes',
      button: 'Send Message on Facebook',
    },
  }),
  coursesPage: reactive<CoursesPageState>({
    eyebrow: 'BOT BUILDER COURSES',
    title: 'Courses Designed for Every Age Group',
    paragraph: 'Choose the learning pathway that fits your child’s interests and skill level.',
    buttonText: 'View Details',
    items: [
      {
        badge: 'Ages 4 - 6 Years',
        title: 'Starter Coders',
        description: [
          'Learn basic mechanics with LEGO Education (WeDo & Spike Essential)',
          'Develop spatial awareness, observation, and step-by-step logical thinking',
        ],
        image: starterImageDefault,
      },
      {
        badge: 'Ages 7 - 10 Years',
        title: 'Explorer Bots',
        description: [
          'Build and program robots using Scratch & Block-based coding',
          'Explore sensors (light, sound, distance) through exciting hands-on challenges',
        ],
        image: explorerImageDefault,
      },
      {
        badge: 'Ages 11 - 16 Years',
        title: 'Master Engineers',
        description: [
          'Design advanced robots with LEGO Spike Prime and Python programming',
          'Prepare for national and international robotics competitions (FLL / WRO)',
        ],
        image: masterImageDefault,
      },
    ],
  }),
  resourcesPage: reactive<ResourcesPageState>({
    eyebrow: 'LEARN & EXPLORE',
    title: 'Resources for Young Creators',
    paragraph: 'Articles, activity sheets, and fun challenges to boost robotics learning.',
    items: [
      {
        icon: 'article',
        title: 'Getting Started with LEGO Spike Prime',
        text: 'Essential structural assembly techniques and sensor guides before building your first robot.',
      },
      {
        icon: 'extension',
        title: '10 Scratch Coding Challenges for Kids',
        text: 'Enhance problem-solving skills with fun mini-games and character animation missions.',
      },
      {
        icon: 'emoji_events',
        title: 'FLL Robotics Competition Prep Guide',
        text: 'Tips from alumni competitors covering strategy planning, presentations, and field missions.',
      },
    ],
  }),
  aboutPage: reactive<AboutPageState>({
    eyebrow: 'ABOUT BOT BUILDER',
    title: 'We Believe the Best Learning Happens by Building',
    intro:
      'Bot Builder creates a learning environment where children experiment, think, and grow alongside technology.',
    missionHeading: 'Our Mission',
    missionText:
      'We develop future-ready skills through joyful hands-on learning in Science, Technology, Engineering, and Mathematics.',
    image: heroImageDefault,
    imageAlt: 'About BotBuilder',
  }),
});

export const INITIAL_NAV_SECTIONS: SectionNavItem[] = [
  { id: 'header', title: 'ส่วนหัวเว็บไซต์', icon: 'web_asset', color: 'green' },
  { id: 'hero', title: 'ส่วนต้อนรับหลัก', icon: 'auto_awesome', color: 'green' },
  { id: 'benefits', title: 'จุดเด่นบริการ', icon: 'verified', color: 'green' },
  { id: 'activityFormats', title: 'รูปแบบกิจกรรม', icon: 'dashboard_customize', color: 'green' },
  { id: 'gallery', title: 'ผลงานและประกาศ', icon: 'workspace_premium', color: 'green' },
  { id: 'activityGallery', title: 'คลังภาพกิจกรรม', icon: 'photo_library', color: 'green' },
  { id: 'quiz', title: 'แบบทดสอบสั้น', icon: 'quiz', color: 'green' },
  { id: 'branches', title: 'สาขาของเรา', icon: 'storefront', color: 'green' },
  { id: 'cta', title: 'ส่วนลงทะเบียน', icon: 'app_registration', color: 'green' },
  { id: 'footer', title: 'ส่วนท้ายเว็บไซต์', icon: 'vertical_align_bottom', color: 'green' },
];

export const SECTION_TITLE_MAP: Record<string, string> = {
  header: 'ส่วนหัวเว็บไซต์ (Header)',
  hero: 'ส่วนต้อนรับหลัก (Hero)',
  benefits: 'จุดเด่นของบริการ (Benefits)',
  activityFormats: 'รูปแบบกิจกรรม (Activity Formats)',
  gallery: 'ผลงานและประกาศ (Gallery)',
  activityGallery: 'คลังภาพกิจกรรม (Activity Gallery)',
  quiz: 'แบบทดสอบสั้น (Quiz)',
  branches: 'สาขาของเรา (Branches)',
  cta: 'ส่วนลงทะเบียน (CTA)',
  footer: 'ส่วนท้ายเว็บไซต์ (Footer)',
};

export const IMAGE_BLOCK_SIZES: Record<string, ImageSizeSpec> = {
  'header.logo': { width: 200, height: 80, label: 'โลโก้เว็บไซต์' },
  'hero.image': { width: 1200, height: 800, label: 'รูปภาพหลัก (Hero)' },
  'activityFormats.item': { width: 800, height: 600, label: 'รูปแบบกิจกรรม' },
  'gallery.certificateImage': { width: 600, height: 800, label: 'รูปใบประกาศนียบัตร' },
  'activityGallery.photo': { width: 400, height: 300, label: 'ภาพกิจกรรม' },
  'promotionsPage.item': { width: 800, height: 600, label: 'รูปโปรโมชั่น' },
  'coursesPage.item': { width: 600, height: 400, label: 'รูปคอร์สเรียน' },
  'aboutPage.image': { width: 800, height: 600, label: 'รูปเกี่ยวกับเรา' },
};

export function getDefaultImageSrcs(): Record<string, string> {
  const fresh = createInitialState();
  return {
    'header.logo': fresh.header.logo,
    'hero.image': fresh.hero.image,
    'gallery.certificateImage': fresh.gallery.certificateImage,
    'aboutPage.image': fresh.aboutPage.image,
  };
}

export const AVAILABLE_ICONS = [
  'star',
  'favorite',
  'thumb_up',
  'verified',
  'check_circle',
  'restart_alt',
  'web_asset',
  'bolt',
  'rocket_launch',
  'local_fire_department',
  'workspace_premium',
  'emoji_events',
  'school',
  'lightbulb',
  'auto_awesome',
  'dashboard_customize',
  'photo_library',
  'smart_toy',
  'code',
  'palette',
  'psychology',
  'groups',
  'person',
  'face',
  'phone',
  'email',
  'location_on',
  'store',
  'storefront',
  'app_registration',
  'vertical_align_bottom',
  'quiz',
  'build',
  'extension',
  'help_outline',
  'info',
  'notifications',
  'schedule',
  'campaign',
  'speed',
  'engineering',
];

export const PAGE_SECTIONS: Record<ActivePage, SectionNavItem[]> = {
  home: [
    { id: 'header', title: 'ส่วนหัวเว็บไซต์', icon: 'web_asset', color: 'green' },
    { id: 'hero', title: 'ส่วนต้อนรับหลัก', icon: 'auto_awesome', color: 'green' },
    { id: 'benefits', title: 'จุดเด่นบริการ', icon: 'verified', color: 'green' },
    { id: 'activityFormats', title: 'รูปแบบกิจกรรม', icon: 'dashboard_customize', color: 'green' },
    { id: 'gallery', title: 'ผลงานและประกาศ', icon: 'workspace_premium', color: 'green' },
    { id: 'activityGallery', title: 'คลังภาพกิจกรรม', icon: 'photo_library', color: 'green' },
    { id: 'quiz', title: 'แบบทดสอบสั้น', icon: 'quiz', color: 'green' },
    { id: 'branches', title: 'สาขาของเรา', icon: 'storefront', color: 'green' },
    { id: 'cta', title: 'ส่วนลงทะเบียน', icon: 'app_registration', color: 'green' },
    { id: 'footer', title: 'ส่วนท้ายเว็บไซต์', icon: 'vertical_align_bottom', color: 'green' },
  ],
  promotions: [
    { id: 'header', title: 'ส่วนหัวเว็บไซต์', icon: 'web_asset', color: 'green' },
    { id: 'promotionsHero', title: 'หัวข้อโปรโมชั่น', icon: 'local_offer', color: 'green' },
    { id: 'promotionsList', title: 'รายการโปรโมชั่น', icon: 'view_list', color: 'green' },
    { id: 'promotionsCta', title: 'ส่วนติดต่อโปรโมชั่น', icon: 'campaign', color: 'green' },
    { id: 'footer', title: 'ส่วนท้ายเว็บไซต์', icon: 'vertical_align_bottom', color: 'green' },
  ],
  courses: [
    { id: 'header', title: 'ส่วนหัวเว็บไซต์', icon: 'web_asset', color: 'green' },
    { id: 'coursesHero', title: 'หัวข้อคอร์สเรียน', icon: 'school', color: 'green' },
    { id: 'coursesList', title: 'รายการคอร์สเรียน', icon: 'grid_view', color: 'green' },
    { id: 'footer', title: 'ส่วนท้ายเว็บไซต์', icon: 'vertical_align_bottom', color: 'green' },
  ],
  resources: [
    { id: 'header', title: 'ส่วนหัวเว็บไซต์', icon: 'web_asset', color: 'green' },
    { id: 'resourcesHero', title: 'หัวข้อคลังความรู้', icon: 'menu_book', color: 'green' },
    { id: 'resourcesList', title: 'รายการบทความ', icon: 'article', color: 'green' },
    { id: 'footer', title: 'ส่วนท้ายเว็บไซต์', icon: 'vertical_align_bottom', color: 'green' },
  ],
  about: [
    { id: 'header', title: 'ส่วนหัวเว็บไซต์', icon: 'web_asset', color: 'green' },
    { id: 'aboutHero', title: 'หัวข้อเกี่ยวกับเรา', icon: 'info', color: 'green' },
    { id: 'aboutMission', title: 'เป้าหมายและวิสัยทัศน์', icon: 'flag', color: 'green' },
    { id: 'footer', title: 'ส่วนท้ายเว็บไซต์', icon: 'vertical_align_bottom', color: 'green' },
  ],
};

export const PAGE_SECTIONS_EN: Record<ActivePage, SectionNavItem[]> = {
  home: [
    { id: 'header', title: 'Header', icon: 'web_asset', color: 'green' },
    { id: 'hero', title: 'Hero', icon: 'auto_awesome', color: 'green' },
    { id: 'benefits', title: 'Benefits', icon: 'verified', color: 'green' },
    {
      id: 'activityFormats',
      title: 'Activity Formats',
      icon: 'dashboard_customize',
      color: 'green',
    },
    { id: 'gallery', title: 'Gallery & Certificates', icon: 'workspace_premium', color: 'green' },
    { id: 'activityGallery', title: 'Activity Gallery', icon: 'photo_library', color: 'green' },
    { id: 'quiz', title: 'Quiz', icon: 'quiz', color: 'green' },
    { id: 'branches', title: 'Our Branches', icon: 'storefront', color: 'green' },
    { id: 'cta', title: 'CTA Registration', icon: 'app_registration', color: 'green' },
    { id: 'footer', title: 'Footer', icon: 'vertical_align_bottom', color: 'green' },
  ],
  promotions: [
    { id: 'header', title: 'Header', icon: 'web_asset', color: 'green' },
    { id: 'promotionsHero', title: 'Promotions Hero', icon: 'local_offer', color: 'green' },
    { id: 'promotionsList', title: 'Promotions List', icon: 'view_list', color: 'green' },
    { id: 'promotionsCta', title: 'Promotions Contact', icon: 'campaign', color: 'green' },
    { id: 'footer', title: 'Footer', icon: 'vertical_align_bottom', color: 'green' },
  ],
  courses: [
    { id: 'header', title: 'Header', icon: 'web_asset', color: 'green' },
    { id: 'coursesHero', title: 'Courses Hero', icon: 'school', color: 'green' },
    { id: 'coursesList', title: 'Courses List', icon: 'grid_view', color: 'green' },
    { id: 'footer', title: 'Footer', icon: 'vertical_align_bottom', color: 'green' },
  ],
  resources: [
    { id: 'header', title: 'Header', icon: 'web_asset', color: 'green' },
    { id: 'resourcesHero', title: 'Resources Hero', icon: 'menu_book', color: 'green' },
    { id: 'resourcesList', title: 'Resources List', icon: 'article', color: 'green' },
    { id: 'footer', title: 'Footer', icon: 'vertical_align_bottom', color: 'green' },
  ],
  about: [
    { id: 'header', title: 'Header', icon: 'web_asset', color: 'green' },
    { id: 'aboutHero', title: 'About Hero', icon: 'info', color: 'green' },
    { id: 'aboutMission', title: 'Mission & Vision', icon: 'flag', color: 'green' },
    { id: 'footer', title: 'Footer', icon: 'vertical_align_bottom', color: 'green' },
  ],
};

export function getFallbackNavSections(
  page: ActivePage,
  locale: EditorLocale = 'th-TH',
): SectionNavItem[] {
  const source = locale === 'en-US' ? PAGE_SECTIONS_EN : PAGE_SECTIONS;
  const sections = source[page] || source.home;
  return sections.map((s) => ({ ...s }));
}
