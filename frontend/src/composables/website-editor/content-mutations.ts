import { contentState } from './state';
import { saveHistorySnapshot } from './history';
import promotionsPhotoDefault from '@/assets/landing/promotions.png';
import starterImageDefault from '@/assets/landing/playlearn.png';

export function addBenefitItem(): void {
  saveHistorySnapshot();
  contentState.benefits.items.push({
    icon: 'star',
    title: 'จุดเด่นใหม่',
    text: 'อธิบายรายละเอียดจุดเด่นเพิ่มเติมตรงนี้...',
  });
}

export function removeBenefitItem(index: number): void {
  if (contentState.benefits.items.length <= 1) return;
  saveHistorySnapshot();
  contentState.benefits.items.splice(index, 1);
}

export function moveBenefitItem(from: number, to: number): void {
  if (to < 0 || to >= contentState.benefits.items.length) return;
  saveHistorySnapshot();
  const item = contentState.benefits.items.splice(from, 1)[0];
  if (item) contentState.benefits.items.splice(to, 0, item);
}

export function addActivityFormatItem(): void {
  saveHistorySnapshot();
  contentState.activityFormats.items.push({
    image:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    title: 'กิจกรรมใหม่',
    description: 'รายละเอียดรูปแบบกิจกรรมใหม่...',
  });
}

export function removeActivityFormatItem(index: number): void {
  if (contentState.activityFormats.items.length <= 1) return;
  saveHistorySnapshot();
  contentState.activityFormats.items.splice(index, 1);
}

export function moveActivityFormatItem(from: number, to: number): void {
  if (to < 0 || to >= contentState.activityFormats.items.length) return;
  saveHistorySnapshot();
  const item = contentState.activityFormats.items.splice(from, 1)[0];
  if (item) contentState.activityFormats.items.splice(to, 0, item);
}

export function addGalleryPhoto(groupIndex: number): void {
  saveHistorySnapshot();
  const grp = contentState.activityGallery.groups[groupIndex];
  if (grp) {
    grp.photos.push({
      src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
      alt: 'ภาพกิจกรรมใหม่',
    });
  }
}

export function removeGalleryPhoto(groupIndex: number, photoIndex: number): void {
  saveHistorySnapshot();
  const grp = contentState.activityGallery.groups[groupIndex];
  if (grp && grp.photos.length > 1) {
    grp.photos.splice(photoIndex, 1);
  }
}

export function addBranchItem(): void {
  saveHistorySnapshot();
  contentState.branches.items.push({
    name: 'สาขาใหม่',
    address: 'ที่อยู่สาขา...',
    description: 'คำอธิบายสาขาใหม่...',
    hours: [{ days: 'จันทร์ - ศุกร์', time: '9.00 - 18.00 น.' }],
    phone: '000-000-0000',
    contactName: 'ผู้ติดต่อ',
    mapEmbedUrl: '',
  });
}

export function removeBranchItem(index: number): void {
  if (contentState.branches.items.length <= 1) return;
  saveHistorySnapshot();
  contentState.branches.items.splice(index, 1);
}

export function addHeroSkill(): void {
  saveHistorySnapshot();
  contentState.hero.skills.push('ทักษะใหม่ (New Skill)');
}

export function removeHeroSkill(index: number): void {
  if (contentState.hero.skills.length <= 1) return;
  saveHistorySnapshot();
  contentState.hero.skills.splice(index, 1);
}

export function addPromotionItem(): void {
  saveHistorySnapshot();
  contentState.promotionsPage.items.push({
    label: 'โปรโมชั่นใหม่',
    title: 'ชื่อโปรโมชั่นใหม่',
    description: ['รายละเอียดโปรโมชั่นใหม่...'],
    details: ['เงื่อนไขเพิ่มเติม...'],
    price: 'ราคาพิเศษ',
    image: promotionsPhotoDefault,
  });
}

export function removePromotionItem(index: number): void {
  if (contentState.promotionsPage.items.length <= 1) return;
  saveHistorySnapshot();
  contentState.promotionsPage.items.splice(index, 1);
}

export function addCourseItem(): void {
  saveHistorySnapshot();
  contentState.coursesPage.items.push({
    badge: 'สำหรับผู้เริ่มต้น',
    title: 'คอร์สเรียนใหม่',
    description: ['รายละเอียดคอร์สเรียนใหม่...'],
    image: starterImageDefault,
  });
}

export function removeCourseItem(index: number): void {
  if (contentState.coursesPage.items.length <= 1) return;
  saveHistorySnapshot();
  contentState.coursesPage.items.splice(index, 1);
}

export function addResourceItem(): void {
  saveHistorySnapshot();
  contentState.resourcesPage.items.push({
    icon: 'lightbulb',
    title: 'หัวข้อความรู้ใหม่',
    text: 'รายละเอียดบทความหรือสื่อการเรียนรู้ใหม่...',
  });
}

export function removeResourceItem(index: number): void {
  if (contentState.resourcesPage.items.length <= 1) return;
  saveHistorySnapshot();
  contentState.resourcesPage.items.splice(index, 1);
}
