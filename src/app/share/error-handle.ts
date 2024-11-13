import Swal from 'sweetalert2'

export class ErrorFormHandle {
  public static showRetry(title = 'เกิดข้อผิดพลาดบางอย่าง', desc = 'ต้องการเริ่มใหม่อีกครั้งหรือไม่ ?', ok_cb: CallableFunction, cancel_cb: CallableFunction = () => { }) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'ant-btn ant-btn-primary ant-btn-small',
        cancelButton: 'ant-btn ant-btn-dangerous ant-btn-small'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: title,
      text: desc,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ตกลง',
      cancelButtonText: 'ยกเลิก',
      reverseButtons: true,
      heightAuto: false
    }).then((result) => {
      if (result.value) {
        ok_cb();
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({ title: 'ตรวจสอบข้อมูลใหม่อีกครั้ง',html:'', icon: 'error',heightAuto:false }).then(() => {
          cancel_cb();
        })
      }
    })
  }
}