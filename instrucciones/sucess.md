Actúa como un desarrollador experto en Next.js (App Router), Tailwind CSS y Stripe. Necesito crear la página de confirmación de pago en app/success/page.tsx.

Requerimientos:

Usa useSearchParams para capturar el session_id de la URL.

Crea un estado de carga (isLoading) mientras haces un fetch a un endpoint interno /api/checkout-session?session_id={id} para obtener los detalles de la compra.

El estado de la orden debe guardar: customerEmail, imageUrl (miniatura de la mascota), y productType (que puede ser 'digital' o 'canvas').

Renderizado Condicional de Expectativas: >    - Si productType es 'digital', muestra un texto diciendo que estamos aplicando la IA para mejorar la resolución a 4K y que recibirá el link de descarga en su correo en 5-10 minutos.

Si productType es 'canvas', muestra un texto diciendo que el retrato 4K ha sido enviado a los talleres de impresión y que recibirá un número de seguimiento en 2-3 días hábiles.

Sección de Resumen: Muestra la imageUrl con diseño elegante (rounded corners, shadow) y el correo del cliente.

Call to Action (LTV): Un banner llamativo al final de la página que diga: '¿Tienes otra mascota? Crea otro retrato ahora con un 50% de descuento usando el código: FAMILY50' y un botón que redirija al inicio (/).

Dame el código completo del componente de React (page.tsx) con un diseño hermoso y profesional usando Tailwind CSS, manejando los estados de carga y errores."