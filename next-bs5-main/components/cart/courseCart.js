import { YaminUseCart } from '@/hooks/yamin-use-cart'
import { YaminCourseUseCart } from '@/hooks/yamin-use-Course-cart'
function CourseCart(props) {
  return (
    <>
      {courseItems.length === 0 ? (
        <div className="checkCartMd">
          <h1>課程購物車為空</h1>
        </div>
      ) : (
        courseItems.map((v) => {
          return (
            <div key={v.id} className="row cartlistBor h5">
              <div className="col-2 text-center colorWhite py-4">
                <img src={v.img1} alt="" />
              </div>
              <div className=" col-4 text-center colorWhite cartlistCol">
                {v.name}
              </div>
              <div className="col-2 text-center colorWhite cartlistCol">
                {v.price}
              </div>
              <div className="col-1 text-center colorWhite cartlistCol">
                <button className="btn cartBtn  h5 cardTotalBtn" type="button">
                  -
                </button>
                <button className="btn cartBtn  h5 cardTotalBtn" type="button">
                  {v.qty}
                </button>
                <button className="btn cartBtn h5 cardTotalBtn" type="button">
                  +
                </button>
              </div>
              <div className="col-2 text-center colorWhite cartlistCol">
                1000
              </div>
              <div className="col-1 text-center  colorWhite cartlistCol">
                <button type="button" className="trashBtn cartBtn">
                  <i className="fa-solid fa-trash-can colorWhite p-3" />
                </button>
              </div>
            </div>
          )
        })
      )}
    </>
  )
}
