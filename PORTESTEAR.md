# Plan de Pruebas — Crowned Portraits

## 1. Fal AI — Generación real

- [ ] Abrir `src/app/components/portrait-wizard.tsx`
- [ ] Cambiar `const TEST_MODE = true` → `false`
- [ ] Commitear y pushear
- [ ] Subir una foto, elegir estilo, generar
- [ ] Verificar que la imagen generada se ve en preview
- [ ] Verificar la URL en sessionStorage (`cleanPortraitUrl`)
- [ ] Monitorear `/api/generate` en Vercel Logs (200, sin errores)

## 2. Gelato — Validar catálogo + órdenes de prueba

- [ ] Obtener product UIDs reales desde Gelato Dashboard:
  - Ir a `dashboard.gelato.com` → API Portal → explorer
  - `POST https://product.gelatoapis.com/v3/catalogs/canvas/products:search`
  - Copiar los `productUid` para los tamaños que vendes (8×10, 12×16, 18×24, 24×36)
  - También para mug: verificar que `MUG_PRODUCT_UID` es correcto
- [ ] Actualizar `.env.local` con los UIDs correctos, especialmente:
  - `GELATO_CANVAS_UID_8X10=...` (el tamaño default en el cart)
  - `GELATO_CANVAS_UID_8X8=...` (si aplica)
- [ ] En Stripe Dashboard, configurar webhook para apuntar a
      `https://aimascot.vercel.app/api/webhooks/stripe`
- [ ] Hacer una compra de prueba con `4242` (canvas + digital + mug opcional)
- [ ] Verificar en Vercel Logs:
  - `[webhook] ▶ Creating Gelato order — uid: ...`
  - `[webhook] ✓ Gelato order created: ...` (o el error)
- [ ] Revisar `dashboard.gelato.com` → Orders → ver si aparece la orden (draft o real)
- [ ] Verificar que `gelato_order_id` y `mug_gelato_order_id` se guardaron en Supabase

## 3. Resend — Correos electrónicos

- [ ] En Resend Dashboard:
  - Verificar que `crownedportraits.com` está verificado como dominio
  - Probar enviar un email manual desde Resend Dashboard a `contact.liada@gmail.com`
  - Verificar si la API key está en modo **test** o **production**
- [ ] Si la key es **test** → solo envía a `contact.liada@gmail.com` (el dueño de la cuenta)
- [ ] Hacer una compra de prueba **usando tu email** (`contact.liada@gmail.com`) en el checkout
- [ ] Monitorear Vercel Logs:
  - `[webhook] ✓ Download email sent → ...`
  - O `[webhook] Resend send failed: ...`
- [ ] Revisar spam folder
- [ ] Si no llega a otros destinatarios → cambiar a **production API key** en Resend

## 4. Verificación final en Supabase

Después de una compra completa:
```sql
SELECT stripe_session_id, product_type, status,
       email_status, email_sent_at, email_delivered_at,
       gelato_order_id, mug_gelato_order_id
FROM orders
WHERE stripe_session_id = 'cs_test_...';
```

- `status` debe ser `COMPLETED`
- `email_status` debe ser `sent` (o `delivered`)
- `gelato_order_id` / `mug_gelato_order_id` deben tener IDs de Gelato
