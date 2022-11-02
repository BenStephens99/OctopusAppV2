const FlexOctv2 = {
    kwhElect: 0.2808,
    standElect:  0.3942,
    kwhGas: 0.0697,
    standGas: 0.2592
}

const BN3_3WQ = new House(
    "BN3_3WQ",
    "88 CLARENDON ROAD", 
    FlexOctv2,
    "1900010392943", 
    "20J0031061",
    "660235107",
    "E6S10940172161"
    );
const Clarendon_Road_88 = [BN3_3WQ];

const BN2_3JB = new House(
    "BN2_3JB",
    "13 INVERNESS ROAD", 
    FlexOctv2,
    "1900013399835", 
    "18P6212993",
    "647710202",
    "G4P62168781800"
    );
const Inverness_Road_13 = [BN2_3JB];

const BN1_5DQ = new House(
    "BN1_5DQ",
    "3 OLD SHOREHAM ROAD", 
    FlexOctv2,
    "1900005374710", 
    "20J0031284",
    "926182207",
    "G4W00136962127"
    );
const Old_Shoreham_Road_3 = [BN1_5DQ];

const BN1_7GD = new House(
    "BN1_7GD",
    "86 ROEDALE ROAD", 
    FlexOctv2,
    "1900016376895", 
    "21J0055783",
    "650347101",
    "G4W00439612127"
    );
const Roedale_Road_86 = [BN1_7GD];

const allHouses = [BN3_3WQ, BN2_3JB, BN1_5DQ, BN1_7GD]