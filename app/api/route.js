import { revalidatePath } from 'next/cache';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get('secret');
    const type = searchParams.get('type');
    const seo = searchParams.get('seo');

    if (secret !== process.env.REVALIDATE_TOKEN) {
        return Response.json({ message: 'Invalid token' }, { status: 401 });
    }

    if (!type || !seo) {
        return Response.json({ message: 'Missing type or SEO parameter' }, { status: 400 });
    }

    try {
        if (type === 'product') {
            revalidatePath(`/products/${seo}`);
        } else if (type === 'category') {
            revalidatePath(`/${seo}`);
        } else {
            return Response.json({ message: 'Invalid type parameter' }, { status: 400 });
        }

        return Response.json({ revalidated: true });
    } catch (err) {
        console.error('Revalidation error:', err);
        return Response.json({ message: 'Error revalidating', error: err.message }, { status: 500 });
    }
}