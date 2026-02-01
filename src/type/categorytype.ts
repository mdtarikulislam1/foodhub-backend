// model Category {
//   id            String    @id @default(uuid())
//   name          String    @db.VarChar(100)
//   slug          String    @unique @db.VarChar(100)
//   image         String
//   description   String?   @db.VarChar(255)
//   isActive      Boolean   @default(true)
//   discount      Int?
//   discountStart DateTime?
//   discountEnd   DateTime?
//   providerId    String
//   provider      User      @relation("categoryProvider", fields: [providerId], references: [id])
//   order         Int?      @default(0)
//   createdAt     DateTime  @default(now())
//   updatedAt     DateTime  @updatedAt
//   products      Product[]

//   @@unique([providerId, name])
//   @@unique([providerId, slug])
//   @@index([providerId])
// }

export interface Category {
  id: string;
  name: string;
  slug?: string;
  image?: string;
  description?: string;
  isActive: boolean;
  discount?: number;
  discountStart?: Date;
  discountEnd?: Date;
  providerId: string;
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
} 

