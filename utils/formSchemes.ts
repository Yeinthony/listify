import * as z from 'zod';
import type { TFunction } from "i18next";

export const recoverPassSchema = (t: TFunction) => z.object({
  email: z.string().min(1, {
    message: t('rules.required')
  }).email({
    message: t('rules.email')
  }),
})

export const signinScheme = (t: TFunction) => z.object({
  email: z.string().min(1, {
      message: t('rules.required')
    }).email({
      message: t('rules.email')
    }),
  password: z.string().min(1, {
    message: t('rules.required')
  })
})

export const register1Scheme = (t: TFunction) => z.object({
  email: z.string().min(1, {
      message: t('rules.required')
    }).email({
      message: t('rules.email')
    }),
  username: z.string().optional()
})

export const register2Scheme = (t: TFunction) =>
  z
    .object({
      password: z
        .string()
        .min(1, { message: t("rules.required") }) 
        .min(6, { message: t("rules.min6", { num: 6 }) }), 

      passwordConfirm: z
        .string()
        .min(1, { message: t("rules.required") }),
    })
    .refine((data) => data.password === data.passwordConfirm, {
      message: t("rules.notMatchPasswords"), 
      path: ["passwordConfirm"],
    });

export const changePasswordScheme = (t: TFunction) => z.object({
  password: z.string().min(1, {
    message: t('rules.required')
  }).min(6, {
    message: t('rules.min6')
  }),
  confirmPassword: z.string().min(1, {
    message: t('rules.required')
  })
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: t('rules.notMatchPasswords'),
    path: ['confirmPassword'],
  }
)

export const verifyCodeScheme = (t: TFunction) =>
  z
    .object({
      code: z
        .string()
        .min(1, { message: t("rules.required") }) 
        .length(6, { message: t("rules.exact6", { num: 6 }) }),
    })

export const ForgotPassword1Scheme = (t: TFunction) => z.object({
  email: z.string().min(1, {
      message: t('rules.required')
    }).email({
      message: t('rules.email')
    })
})

export const registerLocation = (t: TFunction) => z.object({
  title: z.string().min(1, {
      message: t('rules.required')
    }),
  latitude: z.string().min(1, {
      message: t('rules.required')
    }),
  longitude: z.string().min(1, {
      message: t('rules.required')
    }),
  address: z.string().optional()
})

export const createListScheme = (t: TFunction) => z.object({
  name: z.string().min(1, {
      message: t('rules.required')
    }).max(120, {
      message: t('rules.max', { num: 120 })
    }),
  description: z.string().max(500, {
      message: t('rules.max', { num: 500 })
    }).optional(),
})

export const addItemScheme = (t: TFunction) => z.object({
  quantity: z.coerce.number({
      message: t('rules.number')
    }).int().positive({
      message: t('rules.positive')
    }),
  notes: z.string().max(500, {
      message: t('rules.max', { num: 500 })
    }).optional(),
})

export const collaboratorScheme = (t: TFunction) => z.object({
  email: z.string().min(1, {
      message: t('rules.required')
    }).email({
      message: t('rules.email')
    }),
  role: z.enum(['reader', 'editor']),
})
