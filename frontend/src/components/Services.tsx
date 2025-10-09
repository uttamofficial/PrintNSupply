import { motion } from "framer-motion";
import { Printer, ShoppingBag, Zap, Shield } from "lucide-react";

const services = [
  {
    icon: <Printer className="w-12 h-12" />,
    title: "PDF Printing",
    description: "Lightning-fast printing of your PDF documents with various binding options and premium paper quality",
    features: ["High-Quality", "Fast Delivery", "Multiple Bindings"],
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: <ShoppingBag className="w-12 h-12" />,
    title: "Stationery Store",
    description: "Complete range of academic supplies and premium stationery items at student-friendly prices",
    features: ["Wide Selection", "Best Prices", "Top Brands"],
    gradient: "from-purple-500 to-pink-500"
  },
];

export function Services() {
  return (
    <section className="relative py-16 md:py-24 bg-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-float"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-float animation-delay-2000"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12 md:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-blue-50 rounded-full border border-blue-200 mb-4 md:mb-6">
            <Zap className="w-3 md:w-4 h-3 md:h-4 text-blue-600" />
            <span className="text-xs md:text-sm font-semibold text-blue-900">Our Services</span>
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-900 via-blue-700 to-indigo-900 mb-3 md:mb-6">
            Everything You Need
          </h2>
          <p className="text-sm md:text-lg text-gray-600 max-w-2xl mx-auto">
            Professional printing and premium stationery products designed for students
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="group relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              {/* Card */}
              <div className="relative h-full p-6 md:p-10 bg-gradient-to-br from-white to-blue-50/50 rounded-2xl md:rounded-3xl border border-blue-200 hover:border-blue-300 hover:shadow-xl transition-all duration-500 overflow-hidden">
                {/* Hover Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

                {/* Icon with gradient background */}
                <div className="relative inline-flex items-center justify-center w-14 h-14 md:w-20 md:h-20 rounded-xl md:rounded-2xl bg-gradient-to-br from-white to-blue-50 border-2 border-blue-200 mb-4 md:mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-md">
                  <div className="text-blue-600 [&>svg]:w-8 [&>svg]:h-8 md:[&>svg]:w-12 md:[&>svg]:h-12">
                    {service.icon}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl md:text-3xl font-black text-gray-900 mb-2 md:mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-700 group-hover:to-indigo-700 transition-all duration-300">
                  {service.title}
                </h3>
                <p className="text-sm md:text-lg text-gray-600 mb-4 md:mb-8 leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-2 md:space-y-3">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 md:gap-3 text-gray-700">
                      <Shield className="w-4 md:w-5 h-4 md:h-5 text-blue-600 flex-shrink-0" />
                      <span className="text-sm md:text-base font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Animated Bottom Line */}
                <div className={`absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r ${service.gradient} group-hover:w-full transition-all duration-500`}></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}