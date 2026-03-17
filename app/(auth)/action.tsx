'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import z from 'zod';

const schema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z.email('Invalid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'This field should have the same value as password',
    path: ['password_confirmation'],
  });

export async function register(prevState: any, formData: FormData) {
  const name = String(formData.get('name') ?? '');
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');
  const password_confirmation = String(formData.get('password_confirmation') ?? '');
  const data = { name, email, password, password_confirmation };
  const validatedFields = schema.safeParse(data);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: '',
      data,
    };
  }

  let res: Response;

  try {
    res = await fetch(`${process.env.API_URL}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });
  } catch (e) {
    throw new Error(`Network error while registering new user: ${String(e)}`);
  }

  const resJson = await res.json();

  if (!res.ok) {
    return {
      errors: resJson.errors,
      message: resJson.message,
      data,
    };
  }

  const bearerToken = resJson.token;
  const cookiesStore = await cookies();
  cookiesStore.set('token', bearerToken, {
    httpOnly: true,
  });

  revalidatePath('/', 'layout');
  redirect('/');
}

export async function login(prevState: any, formData: FormData) {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');

  let res: Response;

  try {
    res = await fetch(`${process.env.API_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
  } catch (e) {
    throw new Error(`Network error while loging in: ${String(e)}`);
  }

  const resJson = await res.json();

  if (!res.ok) {
    return {
      error: resJson.error,
      data: { email, password },
    };
  }

  const bearerToken = resJson.token;
  const cookiesStore = await cookies();
  cookiesStore.set('token', bearerToken, {
    httpOnly: true,
  });

  revalidatePath('/', 'layout');
  redirect('/');
}

export async function logout(prevState: any, formData: FormData) {
  const cookiesStore = await cookies();
  const token = cookiesStore.get('token')?.value;
  let res: Response;

  try {
    res = await fetch(`${process.env.API_URL}/api/logout`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (e) {
    throw new Error(`Network error while logout : ${String(e)}`);
  }

  revalidatePath('/', 'layout');
  redirect('/');
}
