process.env.NODE_ENV = "test";

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");
let { LocationUser } = require("../models/LocationUserModel");
let { SymptomUser } = require("../models/SymptomUser");
let { DistrictModel } = require("./../models/DistrictModel")
let mongoose = require("mongoose");
const { expect } = chai;
chai.use(chaiHttp);

describe("Districts API", () => {
  //Get Districts - Valid Route
  describe("GET /api/districts", () => {
    let user_location;
    let symptom_user;
    let district;
    beforeEach(async () => {
      symptom_user = new SymptomUser({
        _id: mongoose.Types.ObjectId(),
        user_id: mongoose.Types.ObjectId(),
        symptom_id: mongoose.Types.ObjectId(),
      });
      await symptom_user.save();

      user_location = new LocationUser({
        user_id: symptom_user.user_id,
        location: {
          type: "Point",
          coordinates: [38.796897, 8.985974],
          district: "5f282ce081465a1a28e3fb13"
        },
        TTL: 10000,
      });
      await user_location.save();

      district = new DistrictModel({
        _id: "5f282ce081465a1a28e3fb13",
        name: "Bole",
        state: "Addis Abeba",
        boundaries: {
          type: "Polygon",
          coordinates: [[38.77277374267584, 8.951707839965763], [38.7750511169433, 8.959457397461051], [38.76938629150402, 8.964635848999023], [38.76857757568365, 8.971710205078125], [38.76391220092779, 8.975526809692496], [38.76419830322271, 8.980051994323787], [38.769969940185604, 8.984671592712402], [38.774642944335994, 8.990886688232422], [38.77341461181652, 8.99995040893566], [38.775791168213004, 9.005511283874455], [38.774803161621094, 9.01102256774908], [38.77674102783209, 9.015738487243652], [38.783794403076286, 9.014875411987418], [38.792392730713004, 9.01681900024414], [38.798694610595646, 9.018692970275879], [38.808036804199276, 9.019802093505973], [38.81892013549799, 9.018701553344727], [38.829669952392635, 9.021367073059196], [38.840248107910156, 9.020879745483398], [38.85087585449219, 9.020322799682617], [38.85769271850586, 9.019966125488281], [38.87712860107433, 9.021015167236328], [38.88451766967785, 9.02137374877924], [38.889778137206974, 9.022211074829158], [38.89665985107422, 9.030497550964299], [38.90116119384777, 9.019584655761719], [38.90500259399414, 9.009499549865723], [38.90605545043957, 8.997531890869084], [38.904338836670036, 8.992156982421875], [38.90489959716797, 8.984115600585938], [38.90624237060547, 8.977418899536246], [38.90409469604498, 8.969542503357047], [38.90278625488281, 8.962411880493164], [38.89623641967779, 8.954837799072266], [38.90110015869146, 8.946141242981014], [38.89675903320318, 8.937026977539062], [38.891422271728516, 8.934331893920955], [38.88208007812506, 8.936197280883903], [38.869491577148494, 8.939620018005314], [38.861419677734375, 8.94267749786377], [38.85555648803711, 8.938292503356934], [38.84938430786144, 8.938275337219238], [38.841060638427734, 8.941080093383789], [38.83596801757824, 8.942173957824764], [38.82828903198242, 8.939469337463322], [38.82053756713873, 8.937870025634766], [38.81644439697271, 8.941584587097282], [38.8088836669923, 8.944089889526424], [38.80073547363281, 8.945956230163688], [38.79402923583979, 8.942293167114315], [38.785774230957145, 8.938777923583928], [38.78005981445324, 8.935907363891602], [38.7739372253418, 8.940291404724178], [38.771129608154354, 8.94519901275629], [38.77277374267584, 8.951707839965763]]
        }
      })
      await district.save()
    });
    afterEach(async () => {
      await LocationUser.findByIdAndDelete(user_location._id);
      await SymptomUser.findByIdAndDelete(symptom_user._id);
      await DistrictModel.findByIdAndDelete(district._id);
    });
    it("It should Get symptom users", async () => {
      let response = await chai
        .request(server)
        .get("/api/districts/" + "Bole")
      expect(response).to.have.status(200);
      expect(response.body).to.be.an("array");
    });

    it("It shouldn't Get symptom users", async () => {
      let response = await chai
        .request(server)
        .get("/api/districts/" + "Asdf")
      expect(response).to.have.status(404);
    });
  });
})