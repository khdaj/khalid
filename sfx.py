import numpy as np, wave
SR=44100; D=15.0
rng=np.random.default_rng(7)
mix=np.zeros(int(SR*D))
def t(n): return np.arange(int(SR*n))/SR
def lp(x,fc):
    a=np.exp(-2*np.pi*fc/SR); y=np.zeros_like(x); s=0.0
    for i,v in enumerate(x): s=(1-a)*v+a*s; y[i]=s
    return y
def hp(x,fc): return x-lp(x,fc)
def bp(x,lo,hi): return hp(lp(x,hi),lo)
def add(sig,at,gain=1.0):
    i=int(SR*at); j=min(len(mix),i+len(sig)); mix[i:j]+=sig[:j-i]*gain
def noise(n): return rng.standard_normal(int(SR*n))
def whoosh(dur=0.5,f0=300,f1=3500,gain=1):
    n=noise(dur); tt=t(dur); out=np.zeros_like(n)
    # sweep via crossfaded band-passes
    steps=8
    for k in range(steps):
        fc=f0*(f1/f0)**(k/(steps-1))
        band=bp(n,fc*0.6,fc*1.4)
        c=np.exp(-((tt/dur-(k/(steps-1)))**2)/(2*0.12**2))
        out+=band*c
    env=np.sin(np.pi*np.clip(tt/dur,0,1))**1.5
    out*=env; return out/np.max(np.abs(out))*gain
def impact(dur=0.9,gain=1):
    tt=t(dur); thump=np.sin(2*np.pi*(55+90*np.exp(-tt*18))*tt)*np.exp(-tt*5)
    crack=lp(noise(dur),5000)*np.exp(-tt*28)
    tail=lp(noise(dur),600)*np.exp(-tt*6)*0.4
    o=thump*1.0+crack*0.7+tail; return o/np.max(np.abs(o))*gain
def tick(gain=1):
    tt=t(0.05); o=bp(noise(0.05),1800,6000)*np.exp(-tt*140); return o/np.max(np.abs(o))*gain
def pop(gain=1):
    tt=t(0.18); body=np.sin(2*np.pi*(180+420*np.exp(-tt*40))*tt)*np.exp(-tt*22)
    click=bp(noise(0.18),1000,5000)*np.exp(-tt*90)*0.6
    o=body+click; return o/np.max(np.abs(o))*gain
def riser(dur=1.3,gain=1):
    n=noise(dur); tt=t(dur); out=np.zeros_like(n)
    for k in range(10):
        fc=250*(7000/250)**(k/9)
        c=np.exp(-((tt/dur-k/9)**2)/(2*0.18**2)); out+=bp(n,fc*0.7,fc*1.3)*c
    env=(tt/dur)**2.2; out*=env; return out/np.max(np.abs(out))*gain
L=1/30
add(impact(0.9),0.0+L,0.9)
add(whoosh(0.35,500,5000),0.02,0.55)
add(whoosh(0.4,400,4500),0.95+L,0.7)
add(whoosh(0.4,400,4500),2.05+L,0.6)
add(pop(),2.55+L,0.65)
add(pop(),3.05+L,0.65)
add(pop(),3.55+L,0.5)
add(pop(),3.85+L,0.5)
add(whoosh(0.35,500,5000),5.2+L,0.5)
for k in range(9): add(tick(),5.6+k*0.1+L,0.3)
add(impact(0.8),6.55+L,0.85)
add(pop(),7.1+L,0.6)
add(whoosh(0.5,300,5200),8.5+L,0.7)
add(pop(),9.2+L,0.55)
add(pop(),9.7+L,0.5)
add(riser(1.0),10.0,0.6)
add(impact(1.2),11.0+L,0.95)
add(pop(),12.3+L,0.6)
add(pop(),13.0+L,0.3)
mix=np.tanh(mix*1.1)
pk=np.max(np.abs(mix)); mix=mix/pk*0.8   # ~ -2 dBFS
fade=int(SR*0.4); mix[-fade:]*=np.linspace(1,0,fade)
with wave.open('assets/sfx/mix.wav','wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix*32767).astype(np.int16).tobytes())
print("ok")
