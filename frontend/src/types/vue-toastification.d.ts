declare module "vue-toastification" {
  import { Plugin } from "vue";
  const Toast: Plugin;
  export const useToast: () => {
    success: (msg: string, options?: any) => void;
    error: (msg: string, options?: any) => void;
    info: (msg: string, options?: any) => void;
    warning: (msg: string, options?: any) => void;
  };
  export default Toast;
}
