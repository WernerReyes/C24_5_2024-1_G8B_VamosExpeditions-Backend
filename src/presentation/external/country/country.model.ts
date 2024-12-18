export interface ExternalCountryModel {
  name: Name
  tld?: string[]
  cca2: string
  ccn3?: string
  cca3: string
  independent?: boolean
  status: string
  unMember: boolean
  currencies?: Currencies
  idd: Idd
  capital?: string[]
  altSpellings: string[]
  region: string
  languages?: Languages
  translations: Translations
  latlng: number[]
  landlocked: boolean
  area: number
  demonyms?: Demonyms
  flag: string
  maps: Maps
  population: number
  car: Car
  timezones: string[]
  continents: string[]
  flags: Flags
  coatOfArms: CoatOfArms
  startOfWeek: string
  capitalInfo: CapitalInfo
  cioc?: string
  subregion?: string
  fifa?: string
  borders?: string[]
  gini?: Gini
  postalCode?: PostalCode
}

export interface Name {
  common: string
  official: string
  nativeName?: NativeName
}

export interface NativeName {
  eng?: Eng
  spa?: Spa
  mri?: Mri
  nzs?: Nzs
  ara?: Ara
  heb?: Heb
  deu?: Deu
  fra?: Fra
  nld?: Nld
  kon?: Kon
  lin?: Lin
  smo?: Smo
  por?: Por
  mon?: Mon
  bwg?: Bwg
  kck?: Kck
  khi?: Khi
  ndc?: Ndc
  nde?: Nde
  nya?: Nya
  sna?: Sna
  sot?: Sot
  toi?: Toi
  tsn?: Tsn
  tso?: Tso
  ven?: Ven
  xho?: Xho
  zib?: Zib
  gil?: Gil
  ton?: Ton
  cha?: Cha
  zdj?: Zdj
  msa?: Msa
  pol?: Pol
  jam?: Jam
  dzo?: Dzo
  mya?: Mya
  bjz?: Bjz
  srp?: Srp
  sqi?: Sqi
  fas?: Fas
  div?: Div
  mlt?: Mlt
  rus?: Rus
  tgk?: Tgk
  crs?: Crs
  aym?: Aym
  grn?: Grn
  que?: Que
  jpn?: Jpn
  nrf?: Nrf
  hye?: Hye
  ron?: Ron
  kaz?: Kaz
  slk?: Slk
  lit?: Lit
  kor?: Kor
  swa?: Swa
  tir?: Tir
  sag?: Sag
  swe?: Swe
  nno?: Nno
  nob?: Nob
  smi?: Smi
  pap?: Pap
  gle?: Gle
  tuk?: Tuk
  bar?: Bar
  zho?: Zho
  ita?: Ita
  lat?: Lat
  vie?: Vie
  tet?: Tet
  est?: Est
  kin?: Kin
  niu?: Niu
  bis?: Bis
  ces?: Ces
  som?: Som
  lua?: Lua
  dan?: Dan
  fil?: Fil
  pau?: Pau
  lav?: Lav
  bel?: Bel
  tvl?: Tvl
  hat?: Hat
  tha?: Tha
  ber?: Ber
  mey?: Mey
  nau?: Nau
  ltz?: Ltz
  isl?: Isl
  mah?: Mah
  slv?: Slv
  amh?: Amh
  bos?: Bos
  hrv?: Hrv
  ell?: Ell
  tur?: Tur
  kir?: Kir
  arc?: Arc
  ckb?: Ckb
  khm?: Khm
  kal?: Kal
  bul?: Bul
  afr?: Afr
  her?: Her
  hgm?: Hgm
  kwn?: Kwn
  loz?: Loz
  ndo?: Ndo
  glv?: Glv
  ukr?: Ukr
  ssw?: Ssw
  cnr?: Cnr
  hin?: Hin
  tam?: Tam
  mlg?: Mlg
  nor?: Nor
  pih?: Pih
  hmo?: Hmo
  tpi?: Tpi
  urd?: Urd
  kat?: Kat
  nep?: Nep
  fij?: Fij
  hif?: Hif
  gsw?: Gsw
  roh?: Roh
  hun?: Hun
  ind?: Ind
  lao?: Lao
  cat?: Cat
  run?: Run
  nbl?: Nbl
  nso?: Nso
  zul?: Zul
  cal?: Cal
  mkd?: Mkd
  nfr?: Nfr
  fao?: Fao
  uzb?: Uzb
  sin?: Sin
  ben?: Ben
  prs?: Prs
  pus?: Pus
  rar?: Rar
  fin?: Fin
  tkl?: Tkl
  pov?: Pov
  aze?: Aze
  mfe?: Mfe
}

export interface Eng {
  official: string
  common: string
}

export interface Spa {
  official: string
  common: string
}

export interface Mri {
  official: string
  common: string
}

export interface Nzs {
  official: string
  common: string
}

export interface Ara {
  official: string
  common: string
}

export interface Heb {
  official: string
  common: string
}

export interface Deu {
  official: string
  common: string
}

export interface Fra {
  official: string
  common: string
}

export interface Nld {
  official: string
  common: string
}

export interface Kon {
  official: string
  common: string
}

export interface Lin {
  official: string
  common: string
}

export interface Smo {
  official: string
  common: string
}

export interface Por {
  official: string
  common: string
}

export interface Mon {
  official: string
  common: string
}

export interface Bwg {
  official: string
  common: string
}

export interface Kck {
  official: string
  common: string
}

export interface Khi {
  official: string
  common: string
}

export interface Ndc {
  official: string
  common: string
}

export interface Nde {
  official: string
  common: string
}

export interface Nya {
  official: string
  common: string
}

export interface Sna {
  official: string
  common: string
}

export interface Sot {
  official: string
  common: string
}

export interface Toi {
  official: string
  common: string
}

export interface Tsn {
  official: string
  common: string
}

export interface Tso {
  official: string
  common: string
}

export interface Ven {
  official: string
  common: string
}

export interface Xho {
  official: string
  common: string
}

export interface Zib {
  official: string
  common: string
}

export interface Gil {
  official: string
  common: string
}

export interface Ton {
  official: string
  common: string
}

export interface Cha {
  official: string
  common: string
}

export interface Zdj {
  official: string
  common: string
}

export interface Msa {
  official: string
  common: string
}

export interface Pol {
  official: string
  common: string
}

export interface Jam {
  official: string
  common: string
}

export interface Dzo {
  official: string
  common: string
}

export interface Mya {
  official: string
  common: string
}

export interface Bjz {
  official: string
  common: string
}

export interface Srp {
  official: string
  common: string
}

export interface Sqi {
  official: string
  common: string
}

export interface Fas {
  official: string
  common: string
}

export interface Div {
  official: string
  common: string
}

export interface Mlt {
  official: string
  common: string
}

export interface Rus {
  official: string
  common: string
}

export interface Tgk {
  official: string
  common: string
}

export interface Crs {
  official: string
  common: string
}

export interface Aym {
  official: string
  common: string
}

export interface Grn {
  official: string
  common: string
}

export interface Que {
  official: string
  common: string
}

export interface Jpn {
  official: string
  common: string
}

export interface Nrf {
  official: string
  common: string
}

export interface Hye {
  official: string
  common: string
}

export interface Ron {
  official: string
  common: string
}

export interface Kaz {
  official: string
  common: string
}

export interface Slk {
  official: string
  common: string
}

export interface Lit {
  official: string
  common: string
}

export interface Kor {
  official: string
  common: string
}

export interface Swa {
  official: string
  common: string
}

export interface Tir {
  official: string
  common: string
}

export interface Sag {
  official: string
  common: string
}

export interface Swe {
  official: string
  common: string
}

export interface Nno {
  official: string
  common: string
}

export interface Nob {
  official: string
  common: string
}

export interface Smi {
  official: string
  common: string
}

export interface Pap {
  official: string
  common: string
}

export interface Gle {
  official: string
  common: string
}

export interface Tuk {
  official: string
  common: string
}

export interface Bar {
  official: string
  common: string
}

export interface Zho {
  official: string
  common: string
}

export interface Ita {
  official: string
  common: string
}

export interface Lat {
  official: string
  common: string
}

export interface Vie {
  official: string
  common: string
}

export interface Tet {
  official: string
  common: string
}

export interface Est {
  official: string
  common: string
}

export interface Kin {
  official: string
  common: string
}

export interface Niu {
  official: string
  common: string
}

export interface Bis {
  official: string
  common: string
}

export interface Ces {
  official: string
  common: string
}

export interface Som {
  official: string
  common: string
}

export interface Lua {
  official: string
  common: string
}

export interface Dan {
  official: string
  common: string
}

export interface Fil {
  official: string
  common: string
}

export interface Pau {
  official: string
  common: string
}

export interface Lav {
  official: string
  common: string
}

export interface Bel {
  official: string
  common: string
}

export interface Tvl {
  official: string
  common: string
}

export interface Hat {
  official: string
  common: string
}

export interface Tha {
  official: string
  common: string
}

export interface Ber {
  official: string
  common: string
}

export interface Mey {
  official: string
  common: string
}

export interface Nau {
  official: string
  common: string
}

export interface Ltz {
  official: string
  common: string
}

export interface Isl {
  official: string
  common: string
}

export interface Mah {
  official: string
  common: string
}

export interface Slv {
  official: string
  common: string
}

export interface Amh {
  official: string
  common: string
}

export interface Bos {
  official: string
  common: string
}

export interface Hrv {
  official: string
  common: string
}

export interface Ell {
  official: string
  common: string
}

export interface Tur {
  official: string
  common: string
}

export interface Kir {
  official: string
  common: string
}

export interface Arc {
  official: string
  common: string
}

export interface Ckb {
  official: string
  common: string
}

export interface Khm {
  official: string
  common: string
}

export interface Kal {
  official: string
  common: string
}

export interface Bul {
  official: string
  common: string
}

export interface Afr {
  official: string
  common: string
}

export interface Her {
  official: string
  common: string
}

export interface Hgm {
  official: string
  common: string
}

export interface Kwn {
  official: string
  common: string
}

export interface Loz {
  official: string
  common: string
}

export interface Ndo {
  official: string
  common: string
}

export interface Glv {
  official: string
  common: string
}

export interface Ukr {
  official: string
  common: string
}

export interface Ssw {
  official: string
  common: string
}

export interface Cnr {
  official: string
  common: string
}

export interface Hin {
  official: string
  common: string
}

export interface Tam {
  official: string
  common: string
}

export interface Mlg {
  official: string
  common: string
}

export interface Nor {
  official: string
  common: string
}

export interface Pih {
  official: string
  common: string
}

export interface Hmo {
  official: string
  common: string
}

export interface Tpi {
  official: string
  common: string
}

export interface Urd {
  official: string
  common: string
}

export interface Kat {
  official: string
  common: string
}

export interface Nep {
  official: string
  common: string
}

export interface Fij {
  official: string
  common: string
}

export interface Hif {
  official: string
  common: string
}

export interface Gsw {
  official: string
  common: string
}

export interface Roh {
  official: string
  common: string
}

export interface Hun {
  official: string
  common: string
}

export interface Ind {
  official: string
  common: string
}

export interface Lao {
  official: string
  common: string
}

export interface Cat {
  official: string
  common: string
}

export interface Run {
  official: string
  common: string
}

export interface Nbl {
  official: string
  common: string
}

export interface Nso {
  official: string
  common: string
}

export interface Zul {
  official: string
  common: string
}

export interface Cal {
  official: string
  common: string
}

export interface Mkd {
  official: string
  common: string
}

export interface Nfr {
  official: string
  common: string
}

export interface Fao {
  official: string
  common: string
}

export interface Uzb {
  official: string
  common: string
}

export interface Sin {
  official: string
  common: string
}

export interface Ben {
  official: string
  common: string
}

export interface Prs {
  official: string
  common: string
}

export interface Pus {
  official: string
  common: string
}

export interface Rar {
  official: string
  common: string
}

export interface Fin {
  official: string
  common: string
}

export interface Tkl {
  official: string
  common: string
}

export interface Pov {
  official: string
  common: string
}

export interface Aze {
  official: string
  common: string
}

export interface Mfe {
  official: string
  common: string
}

export interface Currencies {
  XCD?: Xcd
  NIO?: Nio
  NZD?: Nzd
  ILS?: Ils
  EUR?: Eur
  XAF?: Xaf
  USD?: Usd
  MNT?: Mnt
  ZWL?: Zwl
  GHS?: Ghs
  AUD?: Aud
  KID?: Kid
  TOP?: Top
  KMF?: Kmf
  BND?: Bnd
  SGD?: Sgd
  KYD?: Kyd
  PLN?: Pln
  JMD?: Jmd
  LRD?: Lrd
  VES?: Ves
  BTN?: Btn
  INR?: Inr
  MMK?: Mmk
  BZD?: Bzd
  RSD?: Rsd
  BRL?: Brl
  ALL?: All
  IRR?: Irr
  SSP?: Ssp
  MVR?: Mvr
  KWD?: Kwd
  BSD?: Bsd
  NGN?: Ngn
  GMD?: Gmd
  TJS?: Tjs
  GTQ?: Gtq
  SCR?: Scr
  BMD?: Bmd
  CLP?: Clp
  BOB?: Bob
  JPY?: Jpy
  GBP?: Gbp
  JEP?: Jep
  WST?: Wst
  AMD?: Amd
  FKP?: Fkp
  XOF?: Xof
  MDL?: Mdl
  KZT?: Kzt
  AOA?: Aoa
  MRU?: Mru
  JOD?: Jod
  KRW?: Krw
  TZS?: Tzs
  ERN?: Ern
  NOK?: Nok
  ANG?: Ang
  PAB?: Pab
  MZN?: Mzn
  TMT?: Tmt
  HKD?: Hkd
  UYU?: Uyu
  VND?: Vnd
  GYD?: Gyd
  TTD?: Ttd
  RON?: Ron2
  RWF?: Rwf
  KES?: Kes
  SHP?: Shp
  VUV?: Vuv
  XPF?: Xpf
  CZK?: Czk
  SOS?: Sos
  CDF?: Cdf
  SRD?: Srd
  BHD?: Bhd
  GNF?: Gnf
  DKK?: Dkk
  GIP?: Gip
  PHP?: Php
  BYN?: Byn
  HNL?: Hnl
  TVD?: Tvd
  HTG?: Htg
  THB?: Thb
  CRC?: Crc
  DZD?: Dzd
  MAD?: Mad
  ARS?: Ars
  ISK?: Isk
  LSL?: Lsl
  ZAR?: Zar
  MOP?: Mop
  OMR?: Omr
  ETB?: Etb
  BAM?: Bam
  SAR?: Sar
  MWK?: Mwk
  CAD?: Cad
  STN?: Stn
  MYR?: Myr
  RUB?: Rub
  KGS?: Kgs
  CUC?: Cuc
  CUP?: Cup
  SEK?: Sek
  IQD?: Iqd
  KHR?: Khr
  BGN?: Bgn
  AED?: Aed
  NAD?: Nad
  IMP?: Imp
  UAH?: Uah
  PYG?: Pyg
  SZL?: Szl
  SYP?: Syp
  MGA?: Mga
  QAR?: Qar
  DOP?: Dop
  PGK?: Pgk
  LBP?: Lbp
  BWP?: Bwp
  PKR?: Pkr
  GEL?: Gel
  NPR?: Npr
  CHF?: Chf
  FJD?: Fjd
  SDG?: Sdg
  SLL?: Sll
  HUF?: Huf
  TWD?: Twd
  BBD?: Bbd
  TND?: Tnd
  IDR?: Idr
  CVE?: Cve
  LAK?: Lak
  UGX?: Ugx
  BIF?: Bif
  LYD?: Lyd
  MXN?: Mxn
  MKD?: Mkd2
  CNY?: Cny
  YER?: Yer
  GGP?: Ggp
  SBD?: Sbd
  FOK?: Fok
  UZS?: Uzs
  EGP?: Egp
  LKR?: Lkr
  BDT?: Bdt
  PEN?: Pen
  TRY?: Try
  AFN?: Afn
  AWG?: Awg
  CKD?: Ckd
  ZMW?: Zmw
  AZN?: Azn
  DJF?: Djf
  KPW?: Kpw
  MUR?: Mur
  COP?: Cop
}

export interface Xcd {
  name: string
  symbol: string
}

export interface Nio {
  name: string
  symbol: string
}

export interface Nzd {
  name: string
  symbol: string
}

export interface Ils {
  name: string
  symbol: string
}

export interface Eur {
  name: string
  symbol: string
}

export interface Xaf {
  name: string
  symbol: string
}

export interface Usd {
  name: string
  symbol: string
}

export interface Mnt {
  name: string
  symbol: string
}

export interface Zwl {
  name: string
  symbol: string
}

export interface Ghs {
  name: string
  symbol: string
}

export interface Aud {
  name: string
  symbol: string
}

export interface Kid {
  name: string
  symbol: string
}

export interface Top {
  name: string
  symbol: string
}

export interface Kmf {
  name: string
  symbol: string
}

export interface Bnd {
  name: string
  symbol: string
}

export interface Sgd {
  name: string
  symbol: string
}

export interface Kyd {
  name: string
  symbol: string
}

export interface Pln {
  name: string
  symbol: string
}

export interface Jmd {
  name: string
  symbol: string
}

export interface Lrd {
  name: string
  symbol: string
}

export interface Ves {
  name: string
  symbol: string
}

export interface Btn {
  name: string
  symbol: string
}

export interface Inr {
  name: string
  symbol: string
}

export interface Mmk {
  name: string
  symbol: string
}

export interface Bzd {
  name: string
  symbol: string
}

export interface Rsd {
  name: string
  symbol: string
}

export interface Brl {
  name: string
  symbol: string
}

export interface All {
  name: string
  symbol: string
}

export interface Irr {
  name: string
  symbol: string
}

export interface Ssp {
  name: string
  symbol: string
}

export interface Mvr {
  name: string
  symbol: string
}

export interface Kwd {
  name: string
  symbol: string
}

export interface Bsd {
  name: string
  symbol: string
}

export interface Ngn {
  name: string
  symbol: string
}

export interface Gmd {
  name: string
  symbol: string
}

export interface Tjs {
  name: string
  symbol: string
}

export interface Gtq {
  name: string
  symbol: string
}

export interface Scr {
  name: string
  symbol: string
}

export interface Bmd {
  name: string
  symbol: string
}

export interface Clp {
  name: string
  symbol: string
}

export interface Bob {
  name: string
  symbol: string
}

export interface Jpy {
  name: string
  symbol: string
}

export interface Gbp {
  name: string
  symbol: string
}

export interface Jep {
  name: string
  symbol: string
}

export interface Wst {
  name: string
  symbol: string
}

export interface Amd {
  name: string
  symbol: string
}

export interface Fkp {
  name: string
  symbol: string
}

export interface Xof {
  name: string
  symbol: string
}

export interface Mdl {
  name: string
  symbol: string
}

export interface Kzt {
  name: string
  symbol: string
}

export interface Aoa {
  name: string
  symbol: string
}

export interface Mru {
  name: string
  symbol: string
}

export interface Jod {
  name: string
  symbol: string
}

export interface Krw {
  name: string
  symbol: string
}

export interface Tzs {
  name: string
  symbol: string
}

export interface Ern {
  name: string
  symbol: string
}

export interface Nok {
  name: string
  symbol: string
}

export interface Ang {
  name: string
  symbol: string
}

export interface Pab {
  name: string
  symbol: string
}

export interface Mzn {
  name: string
  symbol: string
}

export interface Tmt {
  name: string
  symbol: string
}

export interface Hkd {
  name: string
  symbol: string
}

export interface Uyu {
  name: string
  symbol: string
}

export interface Vnd {
  name: string
  symbol: string
}

export interface Gyd {
  name: string
  symbol: string
}

export interface Ttd {
  name: string
  symbol: string
}

export interface Ron2 {
  name: string
  symbol: string
}

export interface Rwf {
  name: string
  symbol: string
}

export interface Kes {
  name: string
  symbol: string
}

export interface Shp {
  name: string
  symbol: string
}

export interface Vuv {
  name: string
  symbol: string
}

export interface Xpf {
  name: string
  symbol: string
}

export interface Czk {
  name: string
  symbol: string
}

export interface Sos {
  name: string
  symbol: string
}

export interface Cdf {
  name: string
  symbol: string
}

export interface Srd {
  name: string
  symbol: string
}

export interface Bhd {
  name: string
  symbol: string
}

export interface Gnf {
  name: string
  symbol: string
}

export interface Dkk {
  name: string
  symbol: string
}

export interface Gip {
  name: string
  symbol: string
}

export interface Php {
  name: string
  symbol: string
}

export interface Byn {
  name: string
  symbol: string
}

export interface Hnl {
  name: string
  symbol: string
}

export interface Tvd {
  name: string
  symbol: string
}

export interface Htg {
  name: string
  symbol: string
}

export interface Thb {
  name: string
  symbol: string
}

export interface Crc {
  name: string
  symbol: string
}

export interface Dzd {
  name: string
  symbol: string
}

export interface Mad {
  name: string
  symbol: string
}

export interface Ars {
  name: string
  symbol: string
}

export interface Isk {
  name: string
  symbol: string
}

export interface Lsl {
  name: string
  symbol: string
}

export interface Zar {
  name: string
  symbol: string
}

export interface Mop {
  name: string
  symbol: string
}

export interface Omr {
  name: string
  symbol: string
}

export interface Etb {
  name: string
  symbol: string
}

export interface Bam {
  name: string
  symbol: string
}

export interface Sar {
  name: string
  symbol: string
}

export interface Mwk {
  name: string
  symbol: string
}

export interface Cad {
  name: string
  symbol: string
}

export interface Stn {
  name: string
  symbol: string
}

export interface Myr {
  name: string
  symbol: string
}

export interface Rub {
  name: string
  symbol: string
}

export interface Kgs {
  name: string
  symbol: string
}

export interface Cuc {
  name: string
  symbol: string
}

export interface Cup {
  name: string
  symbol: string
}

export interface Sek {
  name: string
  symbol: string
}

export interface Iqd {
  name: string
  symbol: string
}

export interface Khr {
  name: string
  symbol: string
}

export interface Bgn {
  name: string
  symbol: string
}

export interface Aed {
  name: string
  symbol: string
}

export interface Nad {
  name: string
  symbol: string
}

export interface Imp {
  name: string
  symbol: string
}

export interface Uah {
  name: string
  symbol: string
}

export interface Pyg {
  name: string
  symbol: string
}

export interface Szl {
  name: string
  symbol: string
}

export interface Syp {
  name: string
  symbol: string
}

export interface Mga {
  name: string
  symbol: string
}

export interface Qar {
  name: string
  symbol: string
}

export interface Dop {
  name: string
  symbol: string
}

export interface Pgk {
  name: string
  symbol: string
}

export interface Lbp {
  name: string
  symbol: string
}

export interface Bwp {
  name: string
  symbol: string
}

export interface Pkr {
  name: string
  symbol: string
}

export interface Gel {
  name: string
  symbol: string
}

export interface Npr {
  name: string
  symbol: string
}

export interface Chf {
  name: string
  symbol: string
}

export interface Fjd {
  name: string
  symbol: string
}

export interface Sdg {
  name: string
  symbol: string
}

export interface Sll {
  name: string
  symbol: string
}

export interface Huf {
  name: string
  symbol: string
}

export interface Twd {
  name: string
  symbol: string
}

export interface Bbd {
  name: string
  symbol: string
}

export interface Tnd {
  name: string
  symbol: string
}

export interface Idr {
  name: string
  symbol: string
}

export interface Cve {
  name: string
  symbol: string
}

export interface Lak {
  name: string
  symbol: string
}

export interface Ugx {
  name: string
  symbol: string
}

export interface Bif {
  name: string
  symbol: string
}

export interface Lyd {
  name: string
  symbol: string
}

export interface Mxn {
  name: string
  symbol: string
}

export interface Mkd2 {
  name: string
  symbol: string
}

export interface Cny {
  name: string
  symbol: string
}

export interface Yer {
  name: string
  symbol: string
}

export interface Ggp {
  name: string
  symbol: string
}

export interface Sbd {
  name: string
  symbol: string
}

export interface Fok {
  name: string
  symbol: string
}

export interface Uzs {
  name: string
  symbol: string
}

export interface Egp {
  name: string
  symbol: string
}

export interface Lkr {
  name: string
  symbol: string
}

export interface Bdt {
  name: string
  symbol: string
}

export interface Pen {
  name: string
  symbol: string
}

export interface Try {
  name: string
  symbol: string
}

export interface Afn {
  name: string
  symbol: string
}

export interface Awg {
  name: string
  symbol: string
}

export interface Ckd {
  name: string
  symbol: string
}

export interface Zmw {
  name: string
  symbol: string
}

export interface Azn {
  name: string
  symbol: string
}

export interface Djf {
  name: string
  symbol: string
}

export interface Kpw {
  name: string
  symbol: string
}

export interface Mur {
  name: string
  symbol: string
}

export interface Cop {
  name: string
  symbol: string
}

export interface Idd {
  root?: string
  suffixes?: string[]
}

export interface Languages {
  eng?: string
  spa?: string
  mri?: string
  nzs?: string
  ara?: string
  heb?: string
  deu?: string
  fra?: string
  nld?: string
  kon?: string
  lin?: string
  smo?: string
  por?: string
  mon?: string
  bwg?: string
  kck?: string
  khi?: string
  ndc?: string
  nde?: string
  nya?: string
  sna?: string
  sot?: string
  toi?: string
  tsn?: string
  tso?: string
  ven?: string
  xho?: string
  zib?: string
  gil?: string
  ton?: string
  cha?: string
  zdj?: string
  msa?: string
  pol?: string
  jam?: string
  dzo?: string
  mya?: string
  bjz?: string
  srp?: string
  sqi?: string
  fas?: string
  div?: string
  mlt?: string
  rus?: string
  tgk?: string
  crs?: string
  aym?: string
  grn?: string
  que?: string
  jpn?: string
  nrf?: string
  hye?: string
  ron?: string
  kaz?: string
  slk?: string
  lit?: string
  kor?: string
  swa?: string
  tir?: string
  sag?: string
  swe?: string
  nno?: string
  nob?: string
  smi?: string
  pap?: string
  gle?: string
  tuk?: string
  de?: string
  zho?: string
  ita?: string
  lat?: string
  vie?: string
  tet?: string
  est?: string
  kin?: string
  niu?: string
  bis?: string
  ces?: string
  som?: string
  lua?: string
  dan?: string
  fil?: string
  pau?: string
  lav?: string
  bel?: string
  tvl?: string
  hat?: string
  tha?: string
  ber?: string
  mey?: string
  nau?: string
  ltz?: string
  isl?: string
  mah?: string
  slv?: string
  cat?: string
  eus?: string
  glc?: string
  amh?: string
  bos?: string
  hrv?: string
  ell?: string
  tur?: string
  kir?: string
  arc?: string
  ckb?: string
  khm?: string
  kal?: string
  bul?: string
  afr?: string
  her?: string
  hgm?: string
  kwn?: string
  loz?: string
  ndo?: string
  glv?: string
  ukr?: string
  ssw?: string
  cnr?: string
  hin?: string
  tam?: string
  mlg?: string
  nor?: string
  pih?: string
  hmo?: string
  tpi?: string
  urd?: string
  kat?: string
  nep?: string
  fij?: string
  hif?: string
  gsw?: string
  roh?: string
  hun?: string
  ind?: string
  lao?: string
  run?: string
  nbl?: string
  nso?: string
  zul?: string
  cal?: string
  mkd?: string
  nfr?: string
  fao?: string
  uzb?: string
  sin?: string
  ben?: string
  prs?: string
  pus?: string
  rar?: string
  fin?: string
  tkl?: string
  pov?: string
  aze?: string
  mfe?: string
}

export interface Translations {
  ara: Ara2
  bre: Bre
  ces: Ces2
  cym: Cym
  deu: Deu2
  est: Est2
  fin: Fin2
  fra: Fra2
  hrv?: Hrv2
  hun: Hun2
  ita: Ita2
  jpn?: Jpn2
  kor: Kor2
  nld: Nld2
  per?: Per
  pol: Pol2
  por: Por2
  rus: Rus2
  slk: Slk2
  spa: Spa2
  srp: Srp2
  swe: Swe2
  tur: Tur2
  urd: Urd2
  zho?: Zho2
}

export interface Ara2 {
  official: string
  common: string
}

export interface Bre {
  official: string
  common: string
}

export interface Ces2 {
  official: string
  common: string
}

export interface Cym {
  official: string
  common: string
}

export interface Deu2 {
  official: string
  common: string
}

export interface Est2 {
  official: string
  common: string
}

export interface Fin2 {
  official: string
  common: string
}

export interface Fra2 {
  official: string
  common: string
}

export interface Hrv2 {
  official: string
  common: string
}

export interface Hun2 {
  official: string
  common: string
}

export interface Ita2 {
  official: string
  common: string
}

export interface Jpn2 {
  official: string
  common: string
}

export interface Kor2 {
  official: string
  common: string
}

export interface Nld2 {
  official: string
  common: string
}

export interface Per {
  official: string
  common: string
}

export interface Pol2 {
  official: string
  common: string
}

export interface Por2 {
  official: string
  common: string
}

export interface Rus2 {
  official: string
  common: string
}

export interface Slk2 {
  official: string
  common: string
}

export interface Spa2 {
  official: string
  common: string
}

export interface Srp2 {
  official: string
  common: string
}

export interface Swe2 {
  official: string
  common: string
}

export interface Tur2 {
  official: string
  common: string
}

export interface Urd2 {
  official: string
  common: string
}

export interface Zho2 {
  official: string
  common: string
}

export interface Demonyms {
  eng: Eng2
  fra?: Fra3
}

export interface Eng2 {
  f: string
  m: string
}

export interface Fra3 {
  f: string
  m: string
}

export interface Maps {
  googleMaps: string
  openStreetMaps: string
}

export interface Car {
  signs?: string[]
  side: string
}

export interface Flags {
  png: string
  svg: string
  alt?: string
}

export interface CoatOfArms {
  png?: string
  svg?: string
}

export interface CapitalInfo {
  latlng?: number[]
}

export interface Gini {
  "2014"?: number
  "2016"?: number
  "2018"?: number
  "2011"?: number
  "2019"?: number
  "2006"?: number
  "2015"?: number
  "2004"?: number
  "2017"?: number
  "1999"?: number
  "2013"?: number
  "2009"?: number
  "2010"?: number
  "2008"?: number
  "1998"?: number
  "1992"?: number
  "2012"?: number
  "2003"?: number
  "2005"?: number
}

export interface PostalCode {
  format: string
  regex?: string
}
