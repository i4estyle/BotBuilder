import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

export enum AuthTokenPurpose {
  REFRESH = 'REFRESH',
  EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
  PASSWORD_RESET = 'PASSWORD_RESET',
}

@Entity('BB_AUTH_TOKEN')
@Index('IDX_BB_AUTH_TOKEN_HASH', ['tokenHash'], { unique: true })
@Index('IDX_BB_AUTH_TOKEN_ADMIN_PURPOSE', ['adminId', 'purpose'])
export class AuthToken {
  @PrimaryGeneratedColumn({ name: 'AUTH_TOKEN_ID' })
  authTokenId!: number;

  @Column({ name: 'ADMIN_ID', type: 'char', length: 8 })
  adminId!: string;

  @Column({ name: 'PURPOSE', type: 'enum', enum: AuthTokenPurpose })
  purpose!: AuthTokenPurpose;

  @Column({ name: 'TOKEN_HASH', type: 'char', length: 64 })
  tokenHash!: string;

  @Column({ name: 'EXPIRES_AT', type: 'timestamp' })
  expiresAt!: Date;

  @Column({ name: 'USED_AT', type: 'timestamp', nullable: true })
  usedAt?: Date | null;

  @CreateDateColumn({ name: 'CREATED_AT', type: 'timestamp' })
  createdAt!: Date;
}
