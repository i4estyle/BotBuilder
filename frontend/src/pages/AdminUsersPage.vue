<template>
  <q-page class="admin-users-page q-pa-md q-pa-lg-md">
    <div class="row items-start justify-between q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm">
        <h1 class="text-h5 text-weight-bold q-my-none">บัญชีผู้ดูแล</h1>
        <p class="text-grey-7 q-mt-xs q-mb-none">สร้างและดูรายชื่อผู้ที่เข้าถึงระบบหลังบ้าน</p>
      </div>
      <div class="col-12 col-sm-auto">
        <q-btn
          color="primary"
          icon="person_add"
          label="เพิ่มผู้ดูแล"
          no-caps
          @click="dialogOpen = true"
        />
      </div>
    </div>

    <q-banner class="bg-blue-1 text-blue-10 q-mb-md rounded-borders">
      <template #avatar><q-icon name="admin_panel_settings" /></template>
      บัญชีที่สร้างจากหน้านี้เข้าถึงได้เฉพาะระบบหลังบ้าน ไม่มีการเปิดสมัครสมาชิกสาธารณะ
    </q-banner>

    <q-card flat bordered>
      <q-table
        :rows="admins"
        :columns="columns"
        row-key="adminId"
        :loading="loading"
        flat
        :rows-per-page-options="[10, 25, 50]"
        no-data-label="ยังไม่มีบัญชีผู้ดูแล"
      >
        <template #body-cell-status="props">
          <q-td :props="props">
            <q-badge
              :color="props.value === 'ACTIVE' ? 'positive' : 'grey-6'"
              :label="props.value === 'ACTIVE' ? 'ใช้งาน' : 'ปิดใช้งาน'"
            />
          </q-td>
        </template>
        <template #body-cell-createdAt="props">
          <q-td :props="props">{{ formatDate(props.value) }}</q-td>
        </template>
      </q-table>
    </q-card>

    <q-dialog v-model="dialogOpen" persistent>
      <q-card class="admin-users-page__dialog">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">เพิ่มบัญชีผู้ดูแล</div>
          <q-space />
          <q-btn flat round dense icon="close" aria-label="ปิด" @click="closeDialog" />
        </q-card-section>
        <q-form @submit="createAdmin">
          <q-card-section class="q-gutter-md">
            <q-input
              v-model.trim="form.displayName"
              outlined
              label="ชื่อที่แสดง"
              :rules="[required]"
            />
            <q-input
              v-model.trim="form.loginName"
              outlined
              label="ชื่อผู้ใช้งาน"
              hint="ภาษาอังกฤษหรือตัวเลข 3–50 ตัว"
              :rules="[loginNameRule]"
            />
            <q-input
              v-model.trim="form.email"
              outlined
              type="email"
              label="อีเมล"
              :rules="[emailRule]"
            />
            <q-input
              v-model="form.password"
              outlined
              :type="showPassword ? 'text' : 'password'"
              label="รหัสผ่าน"
              hint="อย่างน้อย 8 ตัวอักษร"
              :rules="[passwordRule]"
            >
              <template #append
                ><q-icon
                  :name="showPassword ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="showPassword = !showPassword"
              /></template>
            </q-input>
            <q-input
              v-model="form.confirmPassword"
              outlined
              :type="showPassword ? 'text' : 'password'"
              label="ยืนยันรหัสผ่าน"
              :rules="[confirmPasswordRule]"
            />
            <q-banner v-if="errorMessage" dense rounded class="bg-negative text-white">{{
              errorMessage
            }}</q-banner>
          </q-card-section>
          <q-card-actions align="right" class="q-pa-md q-pt-none">
            <q-btn flat label="ยกเลิก" no-caps :disable="saving" @click="closeDialog" />
            <q-btn
              unelevated
              color="primary"
              type="submit"
              label="สร้างบัญชี"
              no-caps
              :loading="saving"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import type { QTableColumn } from 'quasar';
import axios from 'axios';
import { Notify } from 'quasar';
import { adminAccountsApiService } from '@/services/admin-accounts-api.service';
import type { AdminAccount } from '@/types/admin';

const admins = ref<AdminAccount[]>([]);
const loading = ref(false);
const saving = ref(false);
const dialogOpen = ref(false);
const showPassword = ref(false);
const errorMessage = ref('');
const emptyForm = () => ({
  displayName: '',
  loginName: '',
  email: '',
  password: '',
  confirmPassword: '',
});
const form = reactive(emptyForm());

const columns: QTableColumn<AdminAccount>[] = [
  { name: 'displayName', label: 'ชื่อ', field: 'displayName', align: 'left', sortable: true },
  { name: 'loginName', label: 'ชื่อผู้ใช้งาน', field: 'loginName', align: 'left', sortable: true },
  { name: 'email', label: 'อีเมล', field: 'email', align: 'left', sortable: true },
  { name: 'status', label: 'สถานะ', field: 'status', align: 'left', sortable: true },
  { name: 'createdAt', label: 'สร้างเมื่อ', field: 'createdAt', align: 'left', sortable: true },
];

const required = (value: string) => Boolean(value?.trim()) || 'กรุณากรอกข้อมูล';
const loginNameRule = (value: string) =>
  /^[A-Za-z0-9]{3,50}$/.test(value) || 'ใช้ภาษาอังกฤษหรือตัวเลข 3–50 ตัว';
const emailRule = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'กรุณากรอกอีเมลให้ถูกต้อง';
const passwordRule = (value: string) => value.length >= 8 || 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร';
const confirmPasswordRule = (value: string) => value === form.password || 'รหัสผ่านไม่ตรงกัน';

function resetForm(): void {
  Object.assign(form, emptyForm());
  errorMessage.value = '';
  showPassword.value = false;
}
function closeDialog(): void {
  if (!saving.value) {
    dialogOpen.value = false;
    resetForm();
  }
}
function formatDate(value: string): string {
  return new Intl.DateTimeFormat('th-TH', { dateStyle: 'medium', timeStyle: 'short' }).format(
    new Date(value),
  );
}

async function loadAdmins(): Promise<void> {
  loading.value = true;
  try {
    admins.value = await adminAccountsApiService.list();
  } catch {
    Notify.create({ type: 'negative', message: 'ไม่สามารถโหลดรายชื่อผู้ดูแลได้' });
  } finally {
    loading.value = false;
  }
}

async function createAdmin(): Promise<void> {
  if (
    !form.displayName ||
    !/^[A-Za-z0-9]{3,50}$/.test(form.loginName) ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ||
    form.password.length < 8 ||
    form.password !== form.confirmPassword
  )
    return;
  saving.value = true;
  errorMessage.value = '';
  try {
    const admin = await adminAccountsApiService.create({
      displayName: form.displayName,
      loginName: form.loginName,
      email: form.email,
      password: form.password,
    });
    admins.value.unshift(admin);
    dialogOpen.value = false;
    resetForm();
    Notify.create({ type: 'positive', message: 'สร้างบัญชีผู้ดูแลเรียบร้อยแล้ว' });
  } catch (error) {
    errorMessage.value =
      axios.isAxiosError(error) && error.response?.status === 409
        ? 'ชื่อผู้ใช้งานหรืออีเมลนี้ถูกใช้งานแล้ว'
        : 'ไม่สามารถสร้างบัญชีได้ กรุณาลองใหม่';
  } finally {
    saving.value = false;
  }
}

onMounted(() => void loadAdmins());
</script>

<style scoped lang="scss">
.admin-users-page {
  max-width: 1440px;
  margin: 0 auto;
}
.admin-users-page__dialog {
  width: min(100%, 520px);
}
</style>
