import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import reactDom from "react-dom";

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: var(--secondary);
  padding: 10px;
  font-weight: bold;
  color: var(--secondary-text);
  width: 100px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: var(--primary);
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  width: 200px;
  @media (min-width: 767px) {
    width: 300px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 4px dashed var(--secondary);
  background-color: var(--accent);
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 20) {
      newMintAmount = 20;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);


  return (
    <s.Screen
    style={{ width: "100%", height: "100%" , background:"linear-gradient(to bottom, #0195c2 50%, #000000)"}}
    image={CONFIG.SHOW_BACKGROUND ? "/config/images/site3.png" : null}>
      <s.Container
        flex={1}
        ai={"center"}
        style={{ width: "100%", height: "100%", padding: 24}}
        
        
      >
        <ResponsiveWrapper flex={1} style={{ padding: 5 }} test jc="center" ai="center" >
       <s.Container flex={3} style={{width: "100%", padding: 0}}   ai="center"
          jc="center" >
       <img src="/config/images/nor.png" style={{width: "75%", height: "35%"}}></img>
       </s.Container>
       <s.Container flex={3} style={{width: "100%", padding: 0}}   ai="center"
          jc="center">
        <StyledLogo alt={"logo"} src={"/config/images/bld.png"} style={{width:"85%" , height: "85%", padding:5}} flex={1}/>
        </s.Container>
       <s.Container flex={3} style={{width: "100%", padding: 0}}   ai="center"
          jc="center"> 
       <img src="/config/images/nor2.png" style={{width: "75%", height: "35%"}}></img></s.Container>
              </ResponsiveWrapper>
        <s.SpacerSmall />
        <ResponsiveWrapper flex={1} style={{ padding: 24 }} test style={{width: "100%", height: "100%"}}>
          <s.Container flex={1} jc={"center"} ai={"center"} style={{width: "100%", height: "100%"}}>
            <StyledImg alt={"example"} src={"/config/images/example.gif" } style={{width: "75%", height: "75%"}} />
            
            <ResponsiveWrapper flex={1} style={{padding: 24}} jc="center" ai="center">
            <s.Container flex={1} ai={"center"} style={{width: "75%", height: "75%"}}>
              <StyledButton onClick={event =>  window.location.href='https://nftcalendar.io/event/drippy-bears-society-minting/'}
               style={{
                backgroundColor: "var(--accent)",
                padding: 24,
                borderRadius: 24,
                border: "4px dashed var(--secondary)",
                boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
                height: "75%",
                width: "75%"
              }}>
                 <s.TextDescription style={{
              textAlign: "center",
              color: "var(--primary-text)",
              fontSize: 24,
              padding: 30,
              height:"100%",
              width:"100%"
            }}>As seen on:</s.TextDescription><img alt={"example"} src={"/config/images/nft-calendar-transparent.png"} style={{height: "60%", width: "50%", border:"none"}}></img></StyledButton>
            </s.Container>
            
            
            </ResponsiveWrapper>
          </s.Container>
          
          <s.SpacerLarge />

          <s.Container
            flex={2}
            jc={"center"}
            ai={"center"}
            style={{
              backgroundColor: "var(--accent)",
              padding: 24,
              borderRadius: 24,
              border: "4px dashed var(--secondary)",
              boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
             
            }}
          >
            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 50,
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}
            >
              {data.totalSupply} / {CONFIG.MAX_SUPPLY}
            </s.TextTitle>

            <s.TextDescription
              style={{
                textAlign: "center",
                color: "var(--primary-text)",
              }}
            >
              <StyledLink target={"_blank"} href={CONFIG.SCAN_LINK} style={{color: "var(--accent-text)"}}>
                Contract : {truncate(CONFIG.CONTRACT_ADDRESS, 10)}
                
              </StyledLink>
            </s.TextDescription>
            <s.SpacerSmall />
            {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  The sale has ended.
                </s.TextTitle>
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  You can still find {CONFIG.NFT_NAME} on
                </s.TextDescription>
                <s.SpacerSmall />
                <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                  {CONFIG.MARKETPLACE}
                </StyledLink>
              </>
            ) : (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  One Drippy Bear costs  {CONFIG.DISPLAY_COST}{" "}
                  {CONFIG.NETWORK.SYMBOL}.
                </s.TextTitle>
                <s.SpacerXSmall />
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
               
                </s.TextDescription>
                <s.SpacerSmall />
                {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                  <s.Container ai={"center"} jc={"center"}>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      Connect to the {CONFIG.NETWORK.NAME} network
                    </s.TextDescription>
                    <s.SpacerSmall />
                    <StyledButton
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                      }}
                      style={{backgroundColor:"var(--lowbar)"}}
                    >
                      CONNECT
                    </StyledButton>
                    {blockchain.errorMsg !== "" ? (
                      <>
                        <s.SpacerSmall />
                        <s.TextDescription
                          style={{
                            textAlign: "center",
                            color: "var(--accent-text)",
                          }}
                        >
                          {blockchain.errorMsg}
                        </s.TextDescription>
                      </>
                    ) : null}
                  </s.Container>
                ) : (
                  <>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      {feedback}
                    </s.TextDescription>
                    <s.SpacerMedium />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledRoundButton
                        style={{ lineHeight: 0.4 }}
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          decrementMintAmount();
                        }}
                      >
                        -
                      </StyledRoundButton>
                      <s.SpacerMedium />
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text)",
                        }}
                      >
                        {mintAmount}
                      </s.TextDescription>
                      <s.SpacerMedium />
                      <StyledRoundButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          incrementMintAmount();
                        }}
                      >
                        +
                      </StyledRoundButton>
                    </s.Container>
                    <s.SpacerSmall />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          claimNFTs();
                          getData();
                        }}
                        style={{backgroundColor:"var(--lowbar)"}}
                      >
                        {claimingNft ? "BUSY" : "BUY"}
                      </StyledButton>
                      
                    </s.Container>
                  </>
                )}
              </>
            )}
            <s.SpacerMedium />
          </s.Container>
          <s.SpacerLarge />
          <s.Container flex={1} jc={"center"} ai={"center"} style={{width: "100%", height: "100%"}}>
            <StyledImg
              alt={"example"}
              src={"/config/images/example.gif"}
              style={{ transform: "scaleX(-1)", width: "75%", height: "75%" }}
            />
          </s.Container>
        </ResponsiveWrapper>
        <s.SpacerMedium />
        <s.Container jc={"center"} ai={"center"} style={{ width: "49%" }}>
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)"
            }}
          >
           INFO: Please make sure you are connected to the right network (
            {CONFIG.NETWORK.NAME} Mainnet) and the correct address. Please note:
            Once you make the purchase, you cannot undo this action.
          </s.TextDescription>
          <s.SpacerSmall />
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
            }}
          >
            We have set the gas limit to {CONFIG.GAS_LIMIT} for the contract to
            successfully mint your NFT. We recommend that you don't lower the
            gas limit.
          </s.TextDescription>
        </s.Container>
      </s.Container>
      <s.Container
        flex={1}
        ai={"center"}
        style={{ width: "100%" ,height: "100%",padding: 0}}
        
      ><img src="/config/images/INTRE.png" style={{ width: "100%" ,height: "100%",padding: 0}}></img></s.Container>
       <s.Container
        
        ai="center"
        jc="center"
        style={{ width: "100%",height: "100%",padding: 0 }}
       
      >
      
  
        <ResponsiveWrapper flex={1} style={{ padding: 24 }} test>
                 <s.SpacerSmall />
          <s.Container
        flex={1}
        ai={"center"}
        style={{ width: "100%",height: "100%",padding: 25, display:"inline-block" }}
        
        >
        <StyledImg
              alt={"example"}
              src={"/config/images/172.png"}
              style={{width: "65%", height:"65%" }}
            /></s.Container><s.SpacerSmall />
          <s.Container
        flex={3}
        ai={"center"}
        jc="center"
        style={{ width: "100%",height: "100%",padding: 0, display:"inline-block", verticalAlign:"top", float:"left"}}
        >
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
              fontSize: 40,
              
            }}
          >
         Why should you mint one of the bears?
          </s.TextDescription><s.SpacerSmall /><s.SpacerSmall />
          <s.Container
        flex={1}
        ai={"center"}
        jc="center"
        style={{ width: "100%",height: "100%",padding: 0, display:"inline-block", verticalAlign:"top"}}
        >
          <s.TextDescription
            style={{
              textAlign: "left",
              color: "var(--primary-text)",
              fontSize: 25
            }}
          >
       By minting a bear, you are helping us to develop our project further, you will also join our community, and will be able to be randomly airdropped giveaways that will be
       hosted by us (you can read more on that in the road-map down below). <br></br><br></br>           
       You will also hold a really cool NFT, that works perfectly as a profile picture!

      
          </s.TextDescription>
          </s.Container><s.SpacerSmall />
          </s.Container>
        </ResponsiveWrapper>
        <s.SpacerLarge></s.SpacerLarge>
       <s.Container
        flex={1}
        ai="center"
        jc="center"
        style={{ width: "100%", height: "100%"} }
        
        >
          <s.Container
          flex={1}
          ai="center"
          jc="center"
          style={{ width: "100%", height: "100%",} }
         
          >
          <s.TextDescription
          style={{
            textAlign: "center",
            color: "white",
            fontSize: 50,
            border: "4px solid var(--lowbar)",
            borderRadius: 50,
            padding: 10,
            background:"var(--accent)"
            
          }}
          >
            Roadmap
          </s.TextDescription></s.Container>
          <img src="/config/images/roadmap2.png" style={{width: "100%",height:"100%"}}></img>
        </s.Container>
       
        
        <s.Container
        flex={1}
        ai="center"
      
        style={{ width: "100%", height: "100%",padding: 50} }
        image={"/config/images/dirtbg.png"}
         >
            <s.TextDescription
            style={{
              textAlign: "center",
              color: "white",
              fontSize: 50,
              border: "4px solid var(--accent)",
              borderRadius: 50,
              padding: 15,
              background:"var(--lowbar)"
            }}>
            Meet The Team 
            </s.TextDescription>
            <ResponsiveWrapper flex={1} style={{ padding: 12 }} test>

              <s.Container
          flex={1}
          ai={"center"}
          style={{ width: "100%", height: "100%",padding: 10,background:"var(--accent)", border: "4px solid var(--accent)", borderRadius: 50} }
          >
            <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
              fontSize: 40
            }}>@sorinache</s.TextDescription>
              <img src="/config/images/3.png" style={{width:"50%", height:"50%", border: "4px solid var(--accent)", borderRadius: 50}}></img><s.SpacerSmall></s.SpacerSmall>
              <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
              fontSize: 25
            }}>
              <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
              fontSize: 33
            }}><u>Founder</u></s.TextDescription>
              Hey bears! My name's Sorin. <br></br>
                I'm one of the creators/founders of Drippy Bears Society. I love learning new things, and started this project in hope of building a community and a succesful project.
                I'm hoping that everyone that sees this will stick around.<br></br> See you around.</s.TextDescription>
          </s.Container>
          <s.Container
          flex={1}
          ai="center"
          jc="center"
          style={{ width: "100%", height: "100%",padding: 10,background:"var(--accent)", border: "4px solid var(--accent)", borderRadius: 50} }
          >
            <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
              fontSize: 40
            }}>@bustedinhio</s.TextDescription>
            <img src="/config/images/5.png" style={{width:"50%", height:"50%", border: "4px solid var(--accent)", borderRadius: 50}}></img><s.SpacerSmall></s.SpacerSmall>
            <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
              fontSize: 25
            }}>
              <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
              fontSize: 33,
              width: "100%",
              height: "100%"
            }}><u>Founder</u></s.TextDescription>
            Hello everyone !<br></br> My name is Andrei and I'm one of the creators too. My main goal is to make this world a better place to live in. Stick with us in this beautiful journey.
            <br></br><br></br><br></br>Love you guys XO.</s.TextDescription>


          </s.Container>
          <s.Container
          flex={1}
          ai={"center"}
          style={{ width: "100%", height: "100%",padding: 10,background:"var(--accent)", border: "4px solid var(--accent)", borderRadius: 50} }
          >
            <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
              fontSize: 40
            }}>@teiknd</s.TextDescription>
            <img src="/config/images/4.png" style={{width:"50%", height:"50%", border: "4px solid var(--accent)", borderRadius: 50}}></img><s.SpacerSmall></s.SpacerSmall>
            <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
              fontSize: 25
            }}><s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
              fontSize: 33
            }}
            ai={"center"}><u>Founder</u></s.TextDescription>
            Hello Drippy Bears, my name is Teicu.<br></br> I'm a cinephile and also a Founder of Drippy Bears Society.<br></br>I hope that you enjoy your stay in our community.
            <br></br><br></br><br></br>Hope I catch you on our Discord.</s.TextDescription>


          </s.Container>
            </ResponsiveWrapper>
        
       
       
       
        <s.Container
        flex={1}
        jc="center" ai="center" 
        style={{ width: "100%", height: "100%", backgroundColor: "var(--lowbar)", border:"2px solid var(--accent)", borderRadius: 500,
        boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)"} }
         >
            <ResponsiveWrapper flex={1} style={{ padding: 35 }} jc="center" ai="center" test>

            <s.Container
          flex={1}
          jc="center" ai="center" 
          style={{ width: "100%", height: "100%",padding: 15} }
          >
            <StyledButton onClick={event =>  window.location.href='https://www.twitter.com/dripbearsociety'}
            style={{width: "100%", backgroundColor:"var(--accent)"}}>
    <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
              fontSize: 25
            }}>Twitter</s.TextDescription></StyledButton>

          </s.Container>

          <s.Container
          flex={1}
          ai="center" jc="center"
          style={{ width: "100%", height: "100%",padding: 15} }
          >
            <StyledButton onClick={event =>  window.location.href='https://opensea.io/collection/drippybearssociety'}
            style={{width: "100%", backgroundColor:"var(--accent)"}}>
            <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
              fontSize: 25
            }}>OpenSea</s.TextDescription></StyledButton>
          </s.Container>

          <s.Container
          flex={1}
          ai="center" jc="center"
          style={{ width: "100%", height: "100%",padding: 15} }
          >
               <StyledButton onClick={event =>  window.location.href='https://www.instagram.com/drippybearsociety'}
               style={{width: "100%", backgroundColor:"var(--accent)"}}>
                  <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
              fontSize: 25
            }}>Instagram</s.TextDescription></StyledButton>
          </s.Container>




            </ResponsiveWrapper>
         </s.Container>
            <s.SpacerSmall></s.SpacerSmall>
            <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
              fontSize: 20
            }}>
              Copyright by Drippy Bears Society © 2022
            </s.TextDescription>
      </s.Container>
      </s.Container>
    </s.Screen>

  );
}

export default App;
