export default function MyFooter() {
  return (
    <footer className="mt-auto py-3">
      <div className="container-fluid footer">
        <div className="row border-top pt-5">
          <div className="col-sm-2 col-6 mb-3 d-flex justify-content-center align-items-center">
            <a
              href=""
              className="d-flex align-items-center mb-3 link-body-emphasis text-decoration-none "
            >
              <img
                className="me-2"
                width={116}
                height={165}
                src="/images/footer/Frame 45.png"
                alt=""
              />
            </a>
          </div>
          <div className="col-sm-4 col-6">
            <div className="d-flex flex-row mb-4 mt-2">
              <img
                src="/images/footer/Message.png"
                className="me-2"
                width={20}
                height={20}
                alt=""
              />
              <p>Yaming@gmail.com</p>
            </div>
            <div className="d-flex flex-row mb-4">
              <img
                src="/images/footer/Vector 189.png"
                className="me-2"
                width={18}
                height={18}
                alt=""
              />
              <p>03 453 2632</p>
            </div>
            <div className="d-flex flex-row">
              <img
                src="/images/footer/geo-alt 1.png"
                className="me-2"
                width={20}
                height={20}
                alt=""
              />
              <p>桃園市中壢區新生路二段421號</p>
            </div>
          </div>
          <div className="col-sm-2 col-4">
            <ul className="nav flex-column d-flex justify-content-center align-items-start">
              <li className="nav-item mb-2">
                <a href="#" className="nav-link fs-4 p-0">
                  首頁
                </a>
              </li>
              <li className="nav-item mb-2">
                <a href="#" className="nav-link fs-4 p-0">
                  商品
                </a>
              </li>
              <li className="nav-item mb-2">
                <a href="#" className="nav-link fs-4 p-0">
                  課程
                </a>
              </li>
              <li className="nav-item mb-2">
                <a href="#" className="nav-link fs-4 p-0">
                  文章
                </a>
              </li>
              <li className="nav-item mb-2">
                <a href="#" className="nav-link fs-4 p-0">
                  {' '}
                  問題
                </a>
              </li>
            </ul>
          </div>
          <div className="col-sm-2 col-4">
            <ul className="nav flex-column d-flex justify-content-center align-items-start">
              <li className="nav-item mb-2">
                <a href="#" className="nav-link fs-4 p-0">
                  客戶服務
                </a>
              </li>
              <li className="nav-item mb-2">
                <a href="#" className="nav-link fs-4 p-0">
                  訂購須知
                </a>
              </li>
              <li className="nav-item mb-2">
                <a href="#" className="nav-link fs-4 p-0">
                  退換貨政策
                </a>
              </li>
              <li className="nav-item mb-2">
                <a href="#" className="nav-link fs-4 p-0">
                  條款及細則
                </a>
              </li>
              <li className="nav-item mb-2">
                <a href="#" className="nav-link fs-4 p-0">
                  隱私權政策
                </a>
              </li>
            </ul>
          </div>
          <div className="col-sm-2 col-4 justify-content-center align-items-start">
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <a href="#" className="nav-link fs-4 p-0">
                  關注我們
                </a>
              </li>
              <div className="d-flex flex-row ">
                <img
                  src="/images/footer/Vector.png"
                  width={20}
                  height={20}
                  className="me-3 col-xx-me-5"
                  alt=""
                />
                <img
                  src="/images/footer/ig.png"
                  width={20}
                  height={20}
                  className="me-3 col-lg-me-5"
                  alt=""
                />
                <img
                  src="/images/footer/fb.png"
                  width={20}
                  height={20}
                  className="me-3 col-lg-me-5"
                  alt=""
                />
                <img
                  src="/images/footer/YT.png"
                  width={20}
                  height={15}
                  className="me-2"
                  alt=""
                />
              </div>
            </ul>
          </div>
        </div>
      </div>
      <div className="row company d-flex justify-content-center align-items-center pt-3 pb-3 m-0">
        @2024 Ya MingCompany
      </div>
      <style jsx>
        {`
          .footer {
            background-color: #003e52;
            padding-left: 10vw;
            padding-right: 10vw;
            padding-top: 10px;
          }

          p {
            color: white;
          }

          .nav-link {
            color: white;
          }

          .company {
            background-color: #003e52;
            color: white;
          }
        `}
      </style>
    </footer>
  )
}
