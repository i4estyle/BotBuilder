<template>
  <q-page class="admin-users-page q-pa-md q-pa-lg-md">
    <div
      class="row items-start justify-between q-col-gutter-md q-mb-lg admin-users-page__header"
      :class="{ 'admin-users-page__header--with-toggle': !isDrawerOpen }"
    >
      <div class="col-12 col-sm">
        <h1 class="text-h5 text-weight-bold q-my-none">บัญชีผู้ดูแล</h1>
        <p class="text-grey-7 q-mt-xs q-mb-none">
          สร้าง แก้ไข และจัดการสิทธิ์การเข้าถึงระบบหลังบ้าน
        </p>
      </div>
      <div class="col-12 col-sm-auto">
        <q-btn
          color="primary"
          icon="person_add"
          label="เพิ่มผู้ดูแล"
          no-caps
          class="full-width"
          @click="openCreateDialog"
        />
      </div>
    </div>

    <q-banner class="bg-blue-1 text-blue-10 q-mb-md rounded-borders">
      <template #avatar><q-icon name="admin_panel_settings" /></template>
      บัญชีที่สร้างจากหน้านี้เข้าถึงได้เฉพาะระบบหลังบ้าน ไม่มีการเปิดสมัครสมาชิกสาธารณะ
      การระงับบัญชีจะทำให้ผู้ใช้นั้นออกจากระบบทันที
    </q-banner>

    <q-card flat bordered>
      <q-card-section class="admin-users-page__toolbar">
        <q-input
          v-model="search"
          outlined
          dense
          clearable
          debounce="200"
          placeholder="ค้นหาชื่อ ชื่อผู้ใช้งาน หรืออีเมล"
          class="admin-users-page__search"
        >
          <template #prepend><q-icon name="search" /></template>
        </q-input>
        <q-btn-toggle
          v-model="statusFilter"
          no-caps
          unelevated
          dense
          toggle-color="primary"
          color="grey-2"
          text-color="grey-9"
          class="admin-users-page__filter"
          :options="statusFilterOptions"
        />
      </q-card-section>
      <q-separator />

      <q-table
        :rows="filteredAdmins"
        :columns="columns"
        row-key="adminId"
        :loading="loading"
        :grid="$q.screen.lt.md"
        flat
        :rows-per-page-options="[10, 25, 50]"
        :no-data-label="admins.length ? 'ไม่พบบัญชีที่ตรงกับเงื่อนไข' : 'ยังไม่มีบัญชีผู้ดูแล'"
        :card-container-class="'q-pa-sm'"
      >
        <template #body-cell-displayName="props">
          <q-td :props="props">
            <div class="row items-center no-wrap q-gutter-sm">
              <q-avatar size="32px" color="primary" text-color="white" class="text-weight-bold">
                {{ initials(props.row.displayName) }}
              </q-avatar>
              <span class="text-weight-medium">{{ props.value }}</span>
              <q-badge v-if="isSelf(props.row)" outline color="primary" label="คุณ" />
            </div>
          </q-td>
        </template>
        <template #body-cell-status="props">
          <q-td :props="props">
            <q-badge
              :color="statusMeta(props.value).color"
              :label="statusMeta(props.value).label"
            />
          </q-td>
        </template>
        <template #body-cell-createdAt="props">
          <q-td :props="props">{{ formatDate(props.value) }}</q-td>
        </template>
        <template #body-cell-actions="props">
          <q-td :props="props" auto-width>
            <q-btn
              flat
              round
              dense
              icon="more_vert"
              :aria-label="`จัดการบัญชี ${props.row.displayName}`"
              :loading="busyId === props.row.adminId"
            >
              <AdminActionMenu :admin="props.row" />
            </q-btn>
          </q-td>
        </template>

        <template #item="props">
          <div class="col-12 col-sm-6 q-pa-xs">
            <q-card flat bordered class="admin-users-page__item">
              <q-card-section class="row items-center no-wrap q-gutter-sm">
                <q-avatar size="40px" color="primary" text-color="white" class="text-weight-bold">
                  {{ initials(props.row.displayName) }}
                </q-avatar>
                <div class="col ellipsis">
                  <div class="row items-center q-gutter-xs no-wrap">
                    <span class="text-weight-medium ellipsis">{{ props.row.displayName }}</span>
                    <q-badge v-if="isSelf(props.row)" outline color="primary" label="คุณ" />
                  </div>
                  <div class="text-caption text-grey-7 ellipsis">@{{ props.row.loginName }}</div>
                </div>
                <q-btn
                  flat
                  round
                  dense
                  icon="more_vert"
                  :aria-label="`จัดการบัญชี ${props.row.displayName}`"
                  :loading="busyId === props.row.adminId"
                >
                  <AdminActionMenu :admin="props.row" />
                </q-btn>
              </q-card-section>
              <q-separator />
              <q-card-section class="q-py-sm text-body2">
                <div class="row items-center q-gutter-sm no-wrap q-mb-xs">
                  <q-icon name="mail_outline" color="grey-6" />
                  <span class="ellipsis">{{ props.row.email }}</span>
                </div>
                <div class="row items-center justify-between">
                  <q-badge
                    :color="statusMeta(props.row.status).color"
                    :label="statusMeta(props.row.status).label"
                  />
                  <span class="text-caption text-grey-7">
                    สร้างเมื่อ {{ formatDate(props.row.createdAt) }}
                  </span>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </template>
      </q-table>
    </q-card>

    <!-- Create / edit dialog -->
    <q-dialog v-model="formDialogOpen" persistent>
      <q-card class="admin-users-page__dialog">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ editingAdmin ? 'แก้ไขบัญชีผู้ดูแล' : 'เพิ่มบัญชีผู้ดูแล' }}</div>
          <q-space />
          <q-btn flat round dense icon="close" aria-label="ปิด" @click="closeFormDialog" />
        </q-card-section>
        <q-form @submit="submitForm">
          <q-card-section class="q-gutter-md">
            <q-input
              v-model.trim="form.displayName"
              outlined
              label="ชื่อที่แสดง"
              maxlength="100"
              :rules="[required]"
            />
            <q-input
              v-model.trim="form.loginName"
              outlined
              label="ชื่อผู้ใช้งาน"
              :readonly="Boolean(editingAdmin)"
              :hint="
                editingAdmin ? 'ไม่สามารถเปลี่ยนชื่อผู้ใช้งานได้' : 'ภาษาอังกฤษหรือตัวเลข 3–50 ตัว'
              "
              :rules="editingAdmin ? [] : [loginNameRule]"
            />
            <q-input
              v-model.trim="form.email"
              outlined
              type="email"
              label="อีเมล"
              maxlength="100"
              :hint="
                editingAdmin
                  ? 'ใช้สำหรับเข้าสู่ระบบด้วย Google และรับลิงก์รีเซ็ตรหัสผ่าน'
                  : undefined
              "
              :rules="[emailRule]"
            />
            <template v-if="!editingAdmin">
              <q-input
                v-model="form.password"
                outlined
                :type="showPassword ? 'text' : 'password'"
                label="รหัสผ่าน"
                hint="อย่างน้อย 8 ตัวอักษร"
                :rules="[passwordRule]"
              >
                <template #append>
                  <q-icon
                    :name="showPassword ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="showPassword = !showPassword"
                  />
                </template>
              </q-input>
              <q-input
                v-model="form.confirmPassword"
                outlined
                :type="showPassword ? 'text' : 'password'"
                label="ยืนยันรหัสผ่าน"
                :rules="[confirmPasswordRule]"
              />
            </template>
            <q-banner v-if="errorMessage" dense rounded class="bg-negative text-white">
              {{ errorMessage }}
            </q-banner>
          </q-card-section>
          <q-card-actions align="right" class="q-pa-md q-pt-none">
            <q-btn flat label="ยกเลิก" no-caps :disable="saving" @click="closeFormDialog" />
            <q-btn
              unelevated
              color="primary"
              type="submit"
              :label="editingAdmin ? 'บันทึก' : 'สร้างบัญชี'"
              no-caps
              :loading="saving"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <!-- Confirm dialog -->
    <q-dialog v-model="confirmState.open" :persistent="confirmState.running">
      <q-card class="admin-users-page__dialog">
        <q-card-section class="row items-start no-wrap q-gutter-md">
          <q-avatar :icon="confirmState.icon" :color="confirmState.color" text-color="white" />
          <div class="col">
            <div class="text-h6 q-mb-xs">{{ confirmState.title }}</div>
            <div class="text-body2 text-grey-8">{{ confirmState.message }}</div>
          </div>
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md q-pt-none">
          <q-btn v-close-popup flat label="ยกเลิก" no-caps :disable="confirmState.running" />
          <q-btn
            unelevated
            :color="confirmState.color"
            :label="confirmState.confirmLabel"
            no-caps
            :loading="confirmState.running"
            @click="runConfirm"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, onMounted, reactive, ref } from 'vue';
import type { PropType } from 'vue';
import {
  Notify,
  QIcon,
  QItem,
  QItemSection,
  QList,
  QMenu,
  QSeparator,
  QTooltip,
  useQuasar,
} from 'quasar';
import type { QTableColumn } from 'quasar';
import axios from 'axios';
import { adminAccountsApiService } from '@/services/admin-accounts-api.service';
import { useAuthStore } from '@/stores/auth-store';
import { useAdminDrawer } from '@/composables/use-admin-drawer';
import type { AdminAccount, AdminAccountStatus } from '@/types/admin';

const $q = useQuasar();
const auth = useAuthStore();
// The admin layout shows a floating menu button whenever the drawer is closed
const { isDrawerOpen } = useAdminDrawer();

const admins = ref<AdminAccount[]>([]);
const loading = ref(false);
const saving = ref(false);
const busyId = ref<string | null>(null);
const search = ref<string | null>('');
const statusFilter = ref<'ALL' | 'ACTIVE' | 'SUSPENDED'>('ALL');
const formDialogOpen = ref(false);
const editingAdmin = ref<AdminAccount | null>(null);
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
  { name: 'actions', label: '', field: 'adminId', align: 'right' },
];

const activeCount = computed(() => admins.value.filter((a) => a.status === 'ACTIVE').length);
const statusFilterOptions = computed(() => [
  { label: `ทั้งหมด (${admins.value.length})`, value: 'ALL' },
  { label: `ใช้งาน (${activeCount.value})`, value: 'ACTIVE' },
  { label: `ระงับ (${admins.value.length - activeCount.value})`, value: 'SUSPENDED' },
]);

const filteredAdmins = computed(() => {
  const term = (search.value ?? '').trim().toLowerCase();
  return admins.value.filter((admin) => {
    if (statusFilter.value === 'ACTIVE' && admin.status !== 'ACTIVE') return false;
    if (statusFilter.value === 'SUSPENDED' && admin.status === 'ACTIVE') return false;
    if (!term) return true;
    return [admin.displayName, admin.loginName, admin.email].some((value) =>
      value.toLowerCase().includes(term),
    );
  });
});

const STATUS_META: Record<AdminAccountStatus, { label: string; color: string }> = {
  ACTIVE: { label: 'ใช้งาน', color: 'positive' },
  SUSPENDED: { label: 'ระงับ', color: 'warning' },
  INACTIVE: { label: 'ปิดใช้งาน', color: 'grey-6' },
};
const statusMeta = (status: AdminAccountStatus) => STATUS_META[status] ?? STATUS_META.INACTIVE;

const isSelf = (admin: AdminAccount) => admin.adminId === auth.user?.adminId;
const initials = (name: string) => name.trim().charAt(0).toUpperCase() || '?';

const required = (value: string) => Boolean(value?.trim()) || 'กรุณากรอกข้อมูล';
const LOGIN_NAME_PATTERN = /^[A-Za-z0-9]{3,50}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const loginNameRule = (value: string) =>
  LOGIN_NAME_PATTERN.test(value) || 'ใช้ภาษาอังกฤษหรือตัวเลข 3–50 ตัว';
const emailRule = (value: string) => EMAIL_PATTERN.test(value) || 'กรุณากรอกอีเมลให้ถูกต้อง';
const passwordRule = (value: string) => value.length >= 8 || 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร';
const confirmPasswordRule = (value: string) => value === form.password || 'รหัสผ่านไม่ตรงกัน';

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('th-TH', { dateStyle: 'medium', timeStyle: 'short' }).format(
    new Date(value),
  );
}

function apiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const message = (error.response?.data as { message?: unknown } | undefined)?.message;
    const status = error.response?.status ?? 0;
    if (typeof message === 'string' && (status < 500 || status === 503)) return message;
  }
  return fallback;
}

function replaceAdmin(updated: AdminAccount): void {
  const index = admins.value.findIndex((a) => a.adminId === updated.adminId);
  if (index >= 0) admins.value.splice(index, 1, updated);
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

/* ---------- create / edit ---------- */
function resetForm(): void {
  Object.assign(form, emptyForm());
  errorMessage.value = '';
  showPassword.value = false;
}
function openCreateDialog(): void {
  editingAdmin.value = null;
  resetForm();
  formDialogOpen.value = true;
}
function openEditDialog(admin: AdminAccount): void {
  editingAdmin.value = admin;
  resetForm();
  Object.assign(form, {
    displayName: admin.displayName,
    loginName: admin.loginName,
    email: admin.email,
  });
  formDialogOpen.value = true;
}
function closeFormDialog(): void {
  if (saving.value) return;
  formDialogOpen.value = false;
  editingAdmin.value = null;
  resetForm();
}

async function submitForm(): Promise<void> {
  const editing = editingAdmin.value;
  if (!form.displayName || !EMAIL_PATTERN.test(form.email)) return;
  if (
    !editing &&
    (!LOGIN_NAME_PATTERN.test(form.loginName) ||
      form.password.length < 8 ||
      form.password !== form.confirmPassword)
  )
    return;

  saving.value = true;
  errorMessage.value = '';
  try {
    if (editing) {
      const updated = await adminAccountsApiService.update(editing.adminId, {
        displayName: form.displayName,
        email: form.email,
      });
      replaceAdmin(updated);
      Notify.create({ type: 'positive', message: 'บันทึกการแก้ไขเรียบร้อยแล้ว' });
    } else {
      const admin = await adminAccountsApiService.create({
        displayName: form.displayName,
        loginName: form.loginName,
        email: form.email,
        password: form.password,
      });
      admins.value.unshift(admin);
      Notify.create({ type: 'positive', message: 'สร้างบัญชีผู้ดูแลเรียบร้อยแล้ว' });
    }
    saving.value = false;
    closeFormDialog();
  } catch (error) {
    errorMessage.value =
      axios.isAxiosError(error) && error.response?.status === 409
        ? apiErrorMessage(error, 'ชื่อผู้ใช้งานหรืออีเมลนี้ถูกใช้งานแล้ว')
        : editing
          ? 'ไม่สามารถบันทึกการแก้ไขได้ กรุณาลองใหม่'
          : 'ไม่สามารถสร้างบัญชีได้ กรุณาลองใหม่';
  } finally {
    saving.value = false;
  }
}

/* ---------- confirm actions ---------- */
const confirmState = reactive({
  open: false,
  running: false,
  title: '',
  message: '',
  confirmLabel: '',
  color: 'primary',
  icon: 'help_outline',
  action: null as null | (() => Promise<void>),
});

function askConfirm(options: {
  title: string;
  message: string;
  confirmLabel: string;
  color: string;
  icon: string;
  action: () => Promise<void>;
}): void {
  Object.assign(confirmState, options, { open: true, running: false });
}

async function runConfirm(): Promise<void> {
  if (!confirmState.action) return;
  confirmState.running = true;
  try {
    await confirmState.action();
  } finally {
    confirmState.running = false;
    confirmState.open = false;
  }
}

async function withBusy(admin: AdminAccount, fn: () => Promise<void>, fallback: string) {
  busyId.value = admin.adminId;
  try {
    await fn();
  } catch (error) {
    Notify.create({ type: 'negative', message: apiErrorMessage(error, fallback) });
  } finally {
    busyId.value = null;
  }
}

function confirmToggleStatus(admin: AdminAccount): void {
  const suspending = admin.status === 'ACTIVE';
  askConfirm({
    title: suspending ? 'ระงับบัญชีนี้?' : 'เปิดใช้งานบัญชีนี้?',
    message: suspending
      ? `${admin.displayName} จะออกจากระบบทันทีและเข้าสู่ระบบไม่ได้จนกว่าจะเปิดใช้งานอีกครั้ง`
      : `${admin.displayName} จะกลับมาเข้าสู่ระบบหลังบ้านได้ตามปกติ`,
    confirmLabel: suspending ? 'ระงับบัญชี' : 'เปิดใช้งาน',
    color: suspending ? 'warning' : 'positive',
    icon: suspending ? 'block' : 'check_circle',
    action: () =>
      withBusy(
        admin,
        async () => {
          replaceAdmin(
            await adminAccountsApiService.setStatus(
              admin.adminId,
              suspending ? 'SUSPENDED' : 'ACTIVE',
            ),
          );
          Notify.create({
            type: 'positive',
            message: suspending ? 'ระงับบัญชีแล้ว' : 'เปิดใช้งานบัญชีแล้ว',
          });
        },
        'ไม่สามารถเปลี่ยนสถานะบัญชีได้',
      ),
  });
}

function confirmPasswordReset(admin: AdminAccount): void {
  askConfirm({
    title: 'ส่งลิงก์รีเซ็ตรหัสผ่าน?',
    message: `ระบบจะส่งลิงก์ตั้งรหัสผ่านใหม่ไปที่ ${admin.email} ลิงก์มีอายุ 1 ชั่วโมง`,
    confirmLabel: 'ส่งลิงก์',
    color: 'primary',
    icon: 'lock_reset',
    action: () =>
      withBusy(
        admin,
        async () => {
          await adminAccountsApiService.sendPasswordReset(admin.adminId);
          Notify.create({ type: 'positive', message: `ส่งลิงก์ไปที่ ${admin.email} แล้ว` });
        },
        'ไม่สามารถส่งลิงก์รีเซ็ตรหัสผ่านได้',
      ),
  });
}

function confirmDelete(admin: AdminAccount): void {
  askConfirm({
    title: 'ลบบัญชีผู้ดูแล?',
    message: `บัญชี ${admin.displayName} (@${admin.loginName}) จะถูกลบและออกจากระบบทันที ไม่สามารถกู้คืนจากหน้านี้ได้`,
    confirmLabel: 'ลบบัญชี',
    color: 'negative',
    icon: 'delete_outline',
    action: () =>
      withBusy(
        admin,
        async () => {
          await adminAccountsApiService.remove(admin.adminId);
          admins.value = admins.value.filter((a) => a.adminId !== admin.adminId);
          Notify.create({ type: 'positive', message: 'ลบบัญชีแล้ว' });
        },
        'ไม่สามารถลบบัญชีได้',
      ),
  });
}

/** Why a destructive action is unavailable for this row, or null when allowed. */
function lockReason(admin: AdminAccount): string | null {
  if (isSelf(admin)) return 'ไม่สามารถทำกับบัญชีของตัวเองได้';
  if (admin.status === 'ACTIVE' && activeCount.value <= 1)
    return 'ต้องมีผู้ดูแลที่ใช้งานอยู่อย่างน้อย 1 บัญชี';
  return null;
}

/* ---------- row action menu (shared by table rows and mobile cards) ---------- */
const AdminActionMenu = defineComponent({
  props: { admin: { type: Object as PropType<AdminAccount>, required: true } },
  setup(props) {
    const item = (opts: {
      icon: string;
      label: string;
      color?: string;
      disabled?: string | null;
      onClick: () => void;
    }) =>
      h(
        QItem,
        {
          clickable: !opts.disabled,
          disable: Boolean(opts.disabled),
          onClick: () => {
            if (!opts.disabled) opts.onClick();
          },
        },
        () => [
          h(QItemSection, { avatar: true }, () =>
            h(QIcon, { name: opts.icon, color: opts.disabled ? undefined : opts.color }),
          ),
          h(
            QItemSection,
            { class: opts.disabled ? '' : opts.color ? `text-${opts.color}` : '' },
            () => opts.label,
          ),
          opts.disabled ? h(QTooltip, null, () => opts.disabled) : null,
        ],
      );

    return () => {
      const admin = props.admin;
      const lock = lockReason(admin);
      const active = admin.status === 'ACTIVE';
      return h(QMenu, { autoClose: true, anchor: 'bottom right', self: 'top right' }, () =>
        h(QList, { dense: true, style: 'min-width: 220px' }, () => [
          item({ icon: 'edit', label: 'แก้ไขข้อมูล', onClick: () => openEditDialog(admin) }),
          item({
            icon: 'lock_reset',
            label: 'ส่งลิงก์รีเซ็ตรหัสผ่าน',
            disabled: active ? null : 'เปิดใช้งานบัญชีก่อนส่งลิงก์',
            onClick: () => confirmPasswordReset(admin),
          }),
          h(QSeparator),
          item({
            icon: active ? 'block' : 'check_circle',
            label: active ? 'ระงับบัญชี' : 'เปิดใช้งานบัญชี',
            color: active ? 'warning' : 'positive',
            disabled: active ? lock : null,
            onClick: () => confirmToggleStatus(admin),
          }),
          item({
            icon: 'delete_outline',
            label: 'ลบบัญชี',
            color: 'negative',
            disabled: lock,
            onClick: () => confirmDelete(admin),
          }),
        ]),
      );
    };
  },
});

onMounted(() => void loadAdmins());
</script>

<style scoped lang="scss">
.admin-users-page {
  max-width: 1440px;
  margin: 0 auto;
}
.admin-users-page__header--with-toggle > div:first-child {
  padding-left: 60px;
  min-height: 42px;
}
.admin-users-page__toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
}
.admin-users-page__search {
  flex: 1 1 280px;
  max-width: 420px;
}
.admin-users-page__filter {
  flex-wrap: wrap;
  :deep(.q-btn) {
    padding: 4px 12px;
  }
}
.admin-users-page__item {
  height: 100%;
}
.admin-users-page__dialog {
  width: min(100%, 520px);
}
@media (max-width: 599px) {
  .admin-users-page__search {
    max-width: none;
  }
  .admin-users-page__filter {
    width: 100%;
    :deep(.q-btn) {
      flex: 1 1 0;
    }
  }
}
</style>
