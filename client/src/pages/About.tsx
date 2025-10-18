
const About = () => {
  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">About MetaCodsar</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-semibold mb-6">Our Story</h2>
            <p className="text-lg text-gray-600 mb-6">
              MetaCodsar was founded with a vision to bridge the gap between innovative ideas 
              and cutting-edge technology. We believe in creating software solutions that not 
              only meet current needs but also adapt to future challenges.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              Our team consists of passionate developers, designers, and project managers 
              who work together to deliver exceptional results. We pride ourselves on our 
              commitment to quality, innovation, and client satisfaction.
            </p>
          </div>
          <div className="bg-gray-100 p-8 rounded-lg">
            <h3 className="text-2xl font-semibold mb-6">Our Mission</h3>
            <p className="text-gray-600 mb-4">
              To empower businesses through innovative software solutions that drive growth 
              and efficiency in the digital age.
            </p>
            <h3 className="text-2xl font-semibold mb-6">Our Vision</h3>
            <p className="text-gray-600">
              To be the leading software development company known for delivering 
              transformative digital solutions that exceed client expectations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;