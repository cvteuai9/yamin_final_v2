import React, { useState, useEffect } from 'react'
import axios from 'axios'
import categories from '@/data/course-data/category.json'
import location from '@/data/course-data/location.json'

const baseURL = 'http://localhost:3005/api/course'

const ActivityPage = () => {
  const [activities, setActivities] = useState([]) // 存放活動列表
  const [showForm, setShowForm] = useState(false) // 控制表單顯示
  const [editingActivity, setEditingActivity] = useState(null) // 正在編輯的活動
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    location: '',
    price: 0,
    start_time: '',
    end_time: '',
    limit_people: 0,
    description: '',
    category_id: '',
    current_number: 0,
    valid: 1,
    img1: null,
    img2: null,
    img3: null,
  }) // 表單資料
  const [previewImages, setPreviewImages] = useState({
    img1: null,
    img2: null,
    img3: null,
  })
  const [currentPage, setCurrentPage] = useState(1) // 當前頁碼
  const [totalPages, setTotalPages] = useState(1) // 總頁數
  const [sortOrder, setSortOrder] = useState('ASC') // 排序順序
  const itemsPerPage = 6 // 每頁顯示的項目數量

  useEffect(() => {
    fetchActivities()
  }, [currentPage, sortOrder])

  const fetchActivities = async () => {
    try {
      const response = await axios.get(`${baseURL}`, {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          sort: sortOrder,
          valid: 1,
        },
      })
      setActivities(response.data.courses)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      console.error('Error fetching activities:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'location') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value, // 直接設置為選中的 ID
      }))
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }))
    }
  }

  const handleImageChange = (e, fieldName) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImages((prev) => ({ ...prev, [fieldName]: reader.result }))
      }
      reader.readAsDataURL(file)
      setFormData((prev) => ({ ...prev, [fieldName]: file }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const dataToSend = new FormData()
    Object.keys(formData).forEach((key) => {
      if (key === 'location') {
        const selectedLocation = location.find(
          (loc) => loc.id === parseInt(formData[key])
        )
        dataToSend.append(
          key,
          selectedLocation ? selectedLocation.name.trim() : ''
        )
      } else if (formData[key] instanceof File) {
        dataToSend.append(key, formData[key])
      } else if (formData[key] !== null && formData[key] !== undefined) {
        dataToSend.append(key, formData[key])
      }
    })

    try {
      if (editingActivity) {
        const response = await axios.put(
          `${baseURL}/${editingActivity.id}`,
          dataToSend,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        )
        console.log('Update response:', response.data)
      } else {
        const response = await axios.post(`${baseURL}`, dataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        console.log('Create response:', response.data)
      }

      resetForm()
      fetchActivities()
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  const handleEdit = (activity) => {
    setEditingActivity(activity)
    setFormData({
      ...activity,
      location: activity.location,
      img1: activity.img1,
      img2: activity.img2,
      img3: activity.img3,
    })
    setPreviewImages({
      img1: activity.img1
        ? `../images/yaming/tea_class_picture/${activity.img1}`
        : null,
      img2: activity.img2
        ? `../images/yaming/tea_class_picture/${activity.img2}`
        : null,
      img3: activity.img3
        ? `../images/yaming/tea_class_picture/${activity.img3}`
        : null,
    })
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      location: '',
      price: 0,
      start_time: '',
      end_time: '',
      limit_people: 0,
      description: '',
      category_id: '',
      current_number: 0,
      valid: 1,
      img1: '',
      img2: '',
      img3: '',
    })
    setPreviewImages({
      img1: null,
      img2: null,
      img3: null,
    })
    setShowForm(false)
    setEditingActivity(null)
  }

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  const handleSortById = () => {
    setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC')
  }

  const handleDelete = async (id) => {
    try {
      await axios.put(`${baseURL}/valid/${id}`)
      fetchActivities()
    } catch (error) {
      console.error('Error soft deleting activity:', error)
    }
  }

  const getCategoryName = (id) => {
    const category = categories.find((cat) => cat.id === id)
    return category ? category.name : 'Unknown'
  }

  const getLocationName = (id) => {
    const loc = location.find((loc) => loc.id === id)
    return loc ? loc.name.trim() : 'Unknown'
  }

  return (
    <>
      <div className="container mb-5 mt-5">
        <div className="d-flex justify-content-center mb-1">
          <img
            src="/images/yaming/course_detail/上.png"
            alt=""
            width={80}
            height={8}
          />
        </div>
        <div className="d-flex justify-content-center align-items-center">
          <div className="shane-course-wood mb-4" />
          <div className="h1 shane-course-store row text-center justify-content-center">
            課程後台
            <div className="shane-course-store p text-center ">Course Background</div>
          </div>
          <div className="shane-course-wood mb-4" />
        </div>
        <div className="d-flex justify-content-center mb-1">
          <img
            src="/images/yaming/course/下.png"
            alt=""
            width={80}
            height={8}
          />
        </div>
      </div>
      <div className="course_background_overflow">
        <div className="course_background_body">
          <div className="d-flex justify-content-end">
            <button
              onClick={() => {
                resetForm()
                setShowForm(true)
              }}
              className="course_background_new"
            >
              新增活動
            </button>
          </div>
          {showForm && (
            <div className="course_background_modal">
              <div className="course_background_modal_content">
                <button className="close-button" onClick={resetForm}>
                  ×
                </button>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                  <h2>{editingActivity ? '編輯活動' : '新增活動'}</h2>
                  <div className="form-section">
                    <div className="row">
                      <div className="col-6">
                        <label>活動標題</label>
                        <input
                          type="text"
                          name="name"
                          className="p-4"
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-6">
                        <label>活動地點</label>
                        <select
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                        >
                          <option value="">選擇地點</option>
                          {location.map((loc) => (
                            <option key={loc.id} value={loc.id}>
                              {loc.name.trim()}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <p>費用</p>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-6">
                        <div className="form-item">
                          <p>報名人數</p>
                          <input
                            type="number"
                            name="limit_people"
                            value={formData.limit_people}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <p>活動日期-開始</p>
                        <input
                          type="date"
                          name="start_time"
                          value={formData.start_time}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-6">
                        <p>活動日期-結束</p>
                        <input
                          type="date"
                          name="end_time"
                          value={formData.end_time}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <label>類別</label>
                    <select
                      name="category_id"
                      value={formData.category_id}
                      onChange={handleChange}
                    >
                      <option value="">選擇類別</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <div className="course_background_form-section course_background_flex-row">
                      <div className="form-item">
                        <label>活動簡介</label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="course_background_image-preview">
                      {['img1', 'img2', 'img3'].map((imgField) => (
                        <div
                          key={imgField}
                          className="course_background_image-upload-item"
                        >
                          <label htmlFor={imgField}>
                            Image {imgField.slice(-1)}
                          </label>
                          <input
                            type="file"
                            id={imgField}
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, imgField)}
                          />
                          {previewImages[imgField] && (
                            <img
                              src={`${previewImages[imgField]}`}
                              alt={`Preview ${imgField}`}
                              className="image-preview"
                              style={{ maxWidth: '100px', maxHeight: '100px' }}
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    <button
                      type="submit"
                      className="course_background_submit mt-2"
                    >
                      提交
                    </button>
                    <button
                      type="button"
                      className="course_background_cancel mt-2"
                      onClick={resetForm}
                    >
                      取消
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <table className="course_background_table">
            <thead>
              <tr>
                <th onClick={handleSortById} style={{ cursor: 'pointer' }}>
                  編號 {sortOrder === 'ASC' ? '↑' : '↓'}
                </th>
                <th>標題</th>
                <th>類別</th>
                <th>地點</th>
                <th>費用</th>
                <th>活動日期</th>
                <th>報名人數</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity.id}>
                  <td>{activity.id}</td>
                  <td>{activity.name}</td>
                  <td>{getCategoryName(activity.category_id)}</td>
                  <td>{activity.location}</td>
                  <td>{activity.price}</td>
                  <td>
                    {activity.start_time} - {activity.end_time}
                  </td>
                  <td>{activity.limit_people}</td>
                  <td>
                    <button
                      className="course_background_edit"
                      onClick={() => handleEdit(activity)}
                    >
                      編輯
                    </button>
                    <button
                      className="course_background_delete"
                      onClick={() => handleDelete(activity.id)}
                    >
                      刪除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="course_background_page container">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              上一頁
            </button>
            <span className="course_background_number">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              下一頁
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ActivityPage
