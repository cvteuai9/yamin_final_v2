import React from 'react'
import StarLarge from '@/components/star/star-large'
import { IoEyeSharp } from 'react-icons/io5'
import { FaRegComment } from 'react-icons/fa'
import { FaBookmark } from 'react-icons/fa'
import { FaRegBookmark } from 'react-icons/fa'
import { FaSearch } from 'react-icons/fa'

export default function Order() {
  return (
    <>
      <main className="articledetail">
        <div className="container">
          <StarLarge />
          <div className="row d-flex">
            {/*-------------------- 左邊主要區 ---------------------*/}
            <div className="col-lg-9 article-left pe-lg-3 mx-0 px-0">
              <div className="article_content py-4 mx-4">
                <div className="article_head bd-b1">
                  <h1 className="section-heading p-3">
                    喝出健康有學問!不同顏色的茶，功效大不同
                  </h1>
                  <div className="mobile">
                    <div className="timeandnum d-flex align-items-center my-4 p-3">
                      <p className="p2 mb-0 me-4">2024-06-28</p>
                      <IoEyeSharp color="#ffffffa0" />
                      <p className="p2 mb-0 me-4 ms-2">10</p>
                      <FaRegComment color="#ffffffa0" />
                      <p className="p2 mb-0 me-4 ms-2">10</p>
                      <FaBookmark color="#ffffffa0" />
                      <p className="p2 mb-0 me-4 ms-2">10</p>
                    </div>
                    <div className="addbookmarks d-flex align-items-center p-3">
                      <FaRegBookmark
                        size={16}
                        color="B29564"
                        className="icon"
                      />
                      <p className="ms-2 m-0">加入收藏</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="article-text bd-b1 p-3 mt-3 mx-4">
                <p>
                  茶，一直被視為天然的養生法寶，而茶也的確擁有許多對健康有益的營養成分。喝茶可以防癌、控制血脂、血糖，甚至預防失智。茶葉依照「發酵程度」可以分為6大種類，白茶、青茶、綠茶、紅茶、黑茶、黃茶，每種茶的養生功效也各不相同。較青的茶葉屬輕度發酵，適合體質為熱底的人，而重發酵的茶則適合體質為寒底的人。
                  <br />
                  適合體質為熱底人士的茶
                  <br />
                  1. 白茶（夏天適合喝） 功效︰清熱解毒、生津止渴、提神醒腦
                  <br />
                  白茶味性寒涼。白茶又稱「美白茶」，它的茶氨酸高，能抗氧化，舒緩神經和消除緊張。
                  <br />
                  台灣產的白茶
                  <br />
                  <br />
                  花蓮-白牡丹茶
                  <br />
                  南投-紅玉白茶
                  <br />
                  2. 綠茶（夏天適合喝） 功效︰提神醒腦、生津止渴、清熱解毒
                  <br />
                  <br />
                  綠茶味性寒涼，茶葉輕度發酵，故可清熱解毒，適合熱底人士。另外，研究顯示全日喝4杯綠茶或白茶，可加快燃燒每日的身體代謝率100卡路里，即相等於3個月減重最多1.5公斤；這兩種茶含有兒茶素（Catechin），對新陳代謝有刺激作用。
                  <br />
                  台灣產的綠茶
                  <br />
                  <br />
                  三峽-碧螺春、龍井茶
                  <br />
                  花蓮-蜜香綠茶
                  <br />
                  3. 黃茶 功效︰清熱解毒、祛痰止咳
                  <br />
                  <br />
                  黃茶味性較寒涼，介乎綠茶和白茶之間，屬輕微發酵的茶葉。
                  <br />
                  台灣幾乎不產製黃茶。
                  <br />
                  適合體質為寒底人士的茶
                  <br />
                  1. 黑茶 功效︰溫胃養胃、消滯去膩、驅風醒酒
                  <br />
                  <br />
                  黑茶屬重發酵的茶類，味性溫熱，有暖身作用。另外關於普洱茶是否屬於黑茶，有人認為普洱茶生茶不算是黑茶，只有普洱熟茶是屬於黑茶。
                  <br />
                  台灣幾乎不產黑茶。
                  <br />
                  <br />
                  2. 紅茶 功效︰溫陽活血、暖胃止瀉、散寒除濕
                  <br />
                  <br />
                  紅茶屬於較溫和的茶，同樣有暖身作用，故適合寒底人士。外國的紅茶通常會加少量香油或香精，增添香味，不同紅茶有不同口味。
                  <br />
                  台灣產的紅茶
                  <br />
                  <br />
                  南投-台茶8號、18號、21號
                  <br />
                  三峽、花蓮-蜜香紅茶
                  <br />
                  3. 青茶/烏龍茶（夏天適合喝） 功效︰提神醒腦、有助消化
                  <br />
                  <br />
                  烏龍茶，味性屬平性，介乎發酵和無發酵之間，生津止渴的作用相對較少。但不同體質的人士應視乎茶葉深淺決定是否飲用，否則會削胃。
                  <br />
                  台灣產青茶(烏龍茶)
                  <br />
                  <br />
                  南投、台中、嘉義-青心烏龍
                  <br />
                  新北、新竹、苗栗-白毫烏龍
                  <br />
                  喝茶要適量，建議每天適度喝茶不要超過600 c.c.
                  ，而且不能長期把濃茶當開水飲用。
                </p>
              </div>
              <div className="recom-tea mt-3 p-3 bd-b1">
                <h5 className="p-3">推薦好茶</h5>
                <div className="recom-tea_group mt-3 mb-5">
                  <div className="recom-tea-item p-0">
                    <div className="recom-tea-img"></div>
                    <div className="recom-tea-text p-3">
                      <p className="title">
                        有機紅玉紅茶 Organic Ruby Black Tea - 75g
                      </p>
                      <div className="price d-flex">
                        <p className="me-3">NT$</p>
                        <p>7500</p>
                      </div>
                    </div>
                  </div>
                  {/* <div className="recom-tea-item p-0">
                    <div className="recom-tea-img"></div>
                    <div className="recom-tea-text p-3">
                      <p className="title">
                        有機紅玉紅茶 Organic Ruby Black Tea - 75g
                      </p>
                      <div className="price d-flex">
                        <p className="me-3">NT$</p>
                        <p>7500</p>
                      </div>
                    </div>
                  </div>
                  <div className="recom-tea-item p-0">
                    <div className="recom-tea-img"></div>
                    <div className="recom-tea-text p-3">
                      <p className="title">
                        有機紅玉紅茶 Organic Ruby Black Tea - 75g
                      </p>
                      <div className="price d-flex">
                        <p className="me-3">NT$</p>
                        <p>7500</p>
                      </div>
                    </div>
                  </div>
                  <div className="recom-tea-item p-0">
                    <div className="recom-tea-img"></div>
                    <div className="recom-tea-text p-3">
                      <p className="title">
                        有機紅玉紅茶 Organic Ruby Black Tea - 75g
                      </p>
                      <div className="price d-flex">
                        <p className="me-3">NT$</p>
                        <p>7500</p>
                      </div>
                    </div>
                  </div> */}
                </div>
              </div>
              <div className="comment mt-3 p-3">
                <h5 className="p-3">留言</h5>
                <div className="comment-block mt-3 mb-5">
                  <div className="comment-item d-flex">
                    <div className="d-flex">
                      <div className="com-member-info mt-2">
                        <img
                          src="/images/article/articledetail/member-default.svg"
                          alt=""
                        />
                      </div>
                      <div className="mx-5 mt-2">
                        <p className="mb-3 p-0">阿寶</p>
                        <p className="time m-0 p-0 p2">2024-06-28</p>
                      </div>
                    </div>
                    <div className="com-text p-3">
                      <p>good</p>
                      <p>good</p>
                    </div>
                  </div>
                </div>
                <div className="comment-block mt-3 mb-5">
                  <div className="comment-item d-flex">
                    <div className="d-flex">
                      <div className="com-member-info mt-2">
                        <img
                          src="/images/article/articledetail/lovely.png"
                          alt=""
                        />
                      </div>
                      <div className="mx-5 mt-2">
                        <p className="mb-3 p-0">阿寶</p>
                        <p className="time m-0 p-0 p2">2024-06-28</p>
                      </div>
                    </div>
                    <div className="input-com-text p-3">
                      <textarea
                        type="text"
                        placeholder="發表留言..."
                        defaultValue={''}
                      />
                      <div className="btn-com-text text-end">
                        <button className="cancle m-2">取消</button>
                        <button className="submit m-2">送出</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/*----------------- 右邊 -----------------------*/}
            <div className="col-lg-3 article_info ">
              <div className="row mx-0 ">
                <div className="col-12 ">
                  <div className="all_articles_title bgc-right">
                    <div className="article_right_title mx-0">
                      <h5 className="ps-3 py-3 mt-3">所有文章主題</h5>
                    </div>
                    <div className="articles_group mx-0">
                      <a className="mb-3 btn">茶知識</a>
                      <a className="mb-3 btn">茶創新</a>
                      <a className="mb-3 btn">茶故事</a>
                      <a className="mb-3 btn">茶生活應用</a>
                    </div>
                  </div>
                </div>
                <div className="col-12 mt-5 mx-0">
                  <div className="search_article bgc-right mx-0">
                    <div className="article_right_title">
                      <div className="section-heading">
                        <h5 className="ps-3 py-3 mt-3">文章搜尋</h5>
                      </div>
                    </div>
                    <div className="article_search_block mt-3 ">
                      <button className="icon">
                        <FaSearch size={16} />
                      </button>
                      <input
                        className="ps-3 search"
                        type="text"
                        placeholder="Search in Article"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-12 mt-5">
                  <div className="hot_article bgc-right pb-3">
                    <div className="article_right_title">
                      <div className="section-heading">
                        <h5 className="ps-3 py-3 mt-3">熱門文章</h5>
                      </div>
                    </div>
                    <div className="hot_article_group">
                      <div className="d-flex mt-4">
                        <div className="me-4">
                          <img
                            className="mb-4"
                            src="/images/article/articledetail/article_front.svg"
                            alt=""
                          />
                        </div>
                        <div>
                          <a className="mt-3 article_title">
                            喝出健康有學問!不同顏色的茶，功效大不同
                          </a>
                          <div className="d-flex timeandnum">
                            <p className="p2 mb-0 me-3 py-2">2024-06-28</p>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex mt-4">
                        <div className="me-4">
                          <img
                            className="mb-4"
                            src="/images/article/articledetail/article_front.svg"
                            alt=""
                          />
                        </div>
                        <div>
                          <a className="mt-3 article_title">
                            喝出健康有學問!不同顏色的茶，功效大不同
                          </a>
                          <div className="d-flex timeandnum">
                            <p className="p2 mb-0 me-3 py-2">2024-06-28</p>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex mt-4">
                        <div className="me-4">
                          <img
                            className="mb-4"
                            src="/images/article/articledetail/article_front.svg"
                            alt=""
                          />
                        </div>
                        <div>
                          <a className="mt-3 article_title">
                            喝出健康有學問!不同顏色的茶，功效大不同
                          </a>
                          <div className="d-flex timeandnum">
                            <p className="p2 mb-0 me-3 py-2">2024-06-28</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 mt-5">
                  <div className="new_article bgc-right pb-3">
                    <div className="article_right_title">
                      <div className="section-heading">
                        <h5 className="ps-3 py-3 mt-3">最新文章</h5>
                      </div>
                    </div>
                    <div className="new_article_group">
                      <div className="d-flex mt-4">
                        <div className="me-4">
                          <img
                            className="mb-4"
                            src="/images/article/articledetail/article_front.svg"
                            alt=""
                          />
                        </div>
                        <div>
                          <a className="mt-3 article_title">
                            喝出健康有學問!不同顏色的茶，功效大不同
                          </a>
                          <div className="d-flex timeandnum">
                            <p className="p2 mb-0 me-3 py-2">2024-06-28</p>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex mt-4">
                        <div className="me-4">
                          <img
                            className="mb-4"
                            src="/images/article/articledetail/article_front.svg"
                            alt=""
                          />
                        </div>
                        <div>
                          <a className="mt-3 article_title">
                            喝出健康有學問!不同顏色的茶，功效大不同
                          </a>
                          <div className="d-flex timeandnum">
                            <p className="p2 mb-0 me-3 py-2">2024-06-28</p>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex mt-4">
                        <div className="me-4">
                          <img
                            className="mb-4"
                            src="/images/article/articledetail/article_front.svg"
                            alt=""
                          />
                        </div>
                        <div>
                          <a className="mt-3 article_title">
                            喝出健康有學問!不同顏色的茶，功效大不同
                          </a>
                          <div className="d-flex timeandnum">
                            <p className="p2 mb-0 me-3 py-2">2024-06-28</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
