import FormData from 'form-data';
export function toFormData<T>(formValue: T) {
  const formData = new FormData();
  for (const key of Object.keys(formValue!)) {
    const value = formValue[key as keyof T];

    if (Array.isArray(value)) {
      for (const val of value) {
        formData.append(key, val);
      }
    } else {
      formData.append(key, value ? value : '');
    }
  }
  return formData;
}