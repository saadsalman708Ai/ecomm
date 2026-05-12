import fs from 'fs';
import path from 'path';

const files = [
  'src/app/(admin)/dashboard/categories/page.tsx',
  'src/app/(admin)/dashboard/edit-contact/page.tsx',
  'src/app/(admin)/dashboard/edit-home/component/[componentId]/page.tsx',
  'src/app/(admin)/dashboard/edit-home/hero-component/[componentId]/page.tsx',
  'src/app/(admin)/dashboard/edit-home/image-component/[componentId]/page.tsx',
  'src/app/(admin)/dashboard/edit-home/multi-image-component/[componentId]/page.tsx',
  'src/app/(admin)/dashboard/edit-home/page.tsx',
  'src/app/(admin)/dashboard/orders/[orderId]/delete/page.tsx',
  'src/app/(admin)/dashboard/orders/[orderId]/page.tsx',
  'src/app/(admin)/dashboard/products/[id]/delete/page.tsx',
  'src/app/(admin)/dashboard/products/add/page.tsx',
  'src/app/(admin)/dashboard/products/edit/[id]/page.tsx',
  'src/app/(user)/cancel-order/[id]/page.tsx',
  'src/components/admin/orders/AdminOrderCard.tsx'
];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if(!content.includes("import { message }")) {
    fs.writeFileSync(file, "import { message } from 'antd';\n" + content);
  }
});
console.log('done');
