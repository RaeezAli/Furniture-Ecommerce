"use client"

import { useState } from "react"
import Hero from "../components/common/Hero"

export default function Contact() {
  const titles = ["Contact", "Contact"]

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(formData)
  }

  return (
    <main id="page-4" className="mt-16 md:mt-20">
      <section className="w-full">
        <Hero titles={titles} />
        <div className="flex flex-col items-center justify-center text-center space-y-4 px-4 md:px-6">
          <div className="text-2xl md:text-3xl font-bold mt-12 md:mt-20">Get in touch with us</div>
          <div className="w-full max-w-[644px] text-center">
            <p className="text-sm md:text-base">
              For more information about our product & services, please feel free to drop us an email. Our staff will
              always be there to help you out. Do not hesitate!
            </p>
          </div>
        </div>

        <section className="text-gray-600 body-font relative">
          <div className="container px-4 md:px-5 py-12 md:py-24 mx-auto flex flex-col justify-center items-center lg:flex-row flex-wrap">
            <div className="lg:w-2/3 md:w-full bg-gray-300 rounded-lg overflow-hidden p-4 md:p-10 flex items-end justify-start relative h-[300px] md:h-[400px] lg:h-[500px] lg:mr-10">
              <iframe
                width="100%"
                height="100%"
                className="absolute inset-0"
                title="map"
                src="https://maps.google.com/maps?width=100%25&height=600&hl=en&q=Gulshan-e-Iqbal%20Block%2020,%20Karachi&ie=UTF8&t=&z=14&iwloc=B&output=embed"
                style={{ filter: "grayscale(1) contrast(1.2) opacity(0.4)" }}
              ></iframe>
              <div className="bg-white relative flex flex-wrap py-6 rounded shadow-md w-full">
                <div className="lg:w-1/2 w-full px-6">
                  <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs">ADDRESS</h2>
                  <p className="mt-1 text-sm md:text-base">Our address is Gulistan-e-Johar Block 20</p>
                </div>
                <div className="lg:w-1/2 w-full px-6 mt-4 lg:mt-0">
                  <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs">EMAIL</h2>
                  <a className="text-indigo-500 leading-relaxed text-sm md:text-base">Furniro@email.com</a>
                  <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs mt-4">PHONE</h2>
                  <p className="leading-relaxed text-sm md:text-base">123-456-7890</p>
                </div>
              </div>
            </div>

            <form
              className="lg:w-1/3 md:w-full bg-white flex flex-col w-full md:py-8 mt-8 lg:mt-0"
              onSubmit={handleSubmit}
            >
              <div className="relative mb-4">
                <label htmlFor="name" className="leading-7 text-sm text-gray-600">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-white rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  required
                />
              </div>
              <div className="relative mb-4">
                <label htmlFor="email" className="leading-7 text-sm text-gray-600">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-white rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  required
                />
              </div>
              <div className="relative mb-4">
                <label htmlFor="subject" className="leading-7 text-sm text-gray-600">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-white rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  required
                />
              </div>
              <div className="relative mb-4">
                <label htmlFor="message" className="leading-7 text-sm text-gray-600">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-white rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="text-white bg-[#B88E2F] border-0 py-2 px-6 focus:outline-none hover:bg-[#a07a29] rounded text-lg w-full sm:w-auto sm:max-w-[237px] transition-colors"
              >
                Submit
              </button>
            </form>
          </div>
        </section>
      </section>
    </main>
  )
}

