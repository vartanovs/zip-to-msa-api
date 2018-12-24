# Import httparty and pretty printer clients
require 'httparty'
require 'pp'

class ZipToMSA
  include HTTParty
  # Congigure ZipToMsa to point at AWS Server URL
  base_uri "zip-to-msa-api-prod.mjr2sdfatp.us-west-2.elasticbeanstalk.com "

  def getMSAByZip(zip)
    pp self.class.get('/api', :query => {:zip => zip})
  end
end

# Instantiate ZipToMSA and call with first Command-Line Argument
zip_to_msa = ZipToMSA.new
zip_to_msa.getMSAByZip(ARGV[0])
