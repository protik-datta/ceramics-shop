from PIL import Image
import numpy as np, cv2
U='/mnt/user-data/uploads/'
A=Image.open(U+'1794159858417_image.png').convert('RGB')
B=Image.open(U+'1794159867391_image.png').convert('RGB')
C=Image.open(U+'1794159873721_image.png').convert('RGB')
xs=[137,435,733,1031]
S=271
jobs=[]
for i,x in enumerate(xs): jobs.append((A,x,140))
for i,x in enumerate(xs): jobs.append((B,x,11))
for i,x in enumerate(xs): jobs.append((B,x,464))
jobs.append((C,137,169))
names=['gold-border','rose-flower','pink-rose','green-leaf','green-leaf-2','mixed-floral','yellow-flower','black-floral','peach-flower','classic-1','classic-2','classic-3','classic-8']
mask=np.zeros((S,S),np.uint8)
mask[4:31,4:70]=255
mask[202:S,202:S]=255
for (img,x,y),n in zip(jobs,names):
    c=np.array(img.crop((x,y,x+S,y+S)))
    out=cv2.inpaint(c,mask,5,cv2.INPAINT_TELEA)
    Image.fromarray(out).save(f'public/products/{n}.jpg',quality=90)
# cooking-set thumbnail
A.crop((349,352,398,401)).resize((98,98),Image.LANCZOS).save('public/products/cooking-set.jpg',quality=92)
print('ok')
